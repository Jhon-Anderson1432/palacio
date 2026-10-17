import { createClient } from '@supabase/supabase-js'

// ── Configuración ──────────────────────────────────────────
const PRIMARY_URL = process.env.PRIMARY_SUPABASE_URL
const PRIMARY_KEY = process.env.PRIMARY_SERVICE_ROLE_KEY
const BACKUP_URL  = process.env.BACKUP_SUPABASE_URL
const BACKUP_KEY  = process.env.BACKUP_SERVICE_ROLE_KEY

if (!PRIMARY_URL || !PRIMARY_KEY || !BACKUP_URL || !BACKUP_KEY) {
  console.error('Error: Faltan variables de entorno requeridas:')
  if (!PRIMARY_URL) console.error('   - PRIMARY_SUPABASE_URL')
  if (!PRIMARY_KEY) console.error('   - PRIMARY_SERVICE_ROLE_KEY')
  if (!BACKUP_URL)  console.error('   - BACKUP_SUPABASE_URL')
  if (!BACKUP_KEY)  console.error('   - BACKUP_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Cliente Principal (Solo Lectura)
const primary = createClient(PRIMARY_URL, PRIMARY_KEY, {
  auth: { persistSession: false }
})

// Cliente Reserva (Lectura y Escritura)
const backup = createClient(BACKUP_URL, BACKUP_KEY, {
  auth: { persistSession: false }
})

const STORAGE_BUCKET = 'obras-imagenes'

// ── 1. Sincronizar Tablas ───────────────────────────────────
async function syncTable(tableName, imageFields = []) {
  console.log(`\nSincronizando tabla: "${tableName}"...`)

  // 1. Obtener todos los registros de la DB principal
  const { data: rows, error: readError } = await primary
    .from(tableName)
    .select('*')

  if (readError) {
    console.error(`  Error leyendo "${tableName}" en la DB principal:`, readError.message)
    return
  }

  console.log(`  ${rows.length} registros obtenidos de la DB principal`)

  // 2. Reescribir URLs de imágenes para que apunten a la DB de reserva
  const rewrittenRows = rows.map(row => {
    const newRow = { ...row }
    for (const field of imageFields) {
      if (newRow[field] && typeof newRow[field] === 'string') {
        newRow[field] = newRow[field].replaceAll(PRIMARY_URL, BACKUP_URL)
      }
    }
    return newRow
  })

  // 3. Upsert en la DB de reserva en lotes de 200
  const BATCH_SIZE = 200
  for (let i = 0; i < rewrittenRows.length; i += BATCH_SIZE) {
    const batch = rewrittenRows.slice(i, i + BATCH_SIZE)
    const { error: upsertError } = await backup
      .from(tableName)
      .upsert(batch, { onConflict: 'id' })

    if (upsertError) {
      console.error(`  Error en upsert lote [${i} a ${i + batch.length}] en "${tableName}":`, upsertError.message)
      return
    }
  }

  // 4. Limpiar registros que hayan sido eliminados en la principal
  const { data: backupRows, error: checkError } = await backup
    .from(tableName)
    .select('id')

  if (!checkError && backupRows) {
    const primaryIdSet = new Set(rows.map(r => r.id))
    const idsToDelete = backupRows.filter(r => !primaryIdSet.has(r.id)).map(r => r.id)

    if (idsToDelete.length > 0) {
      console.log(`  Eliminando ${idsToDelete.length} registros obsoletos en reserva...`)
      for (let i = 0; i < idsToDelete.length; i += 100) {
        const batchIds = idsToDelete.slice(i, i + 100)
        await backup.from(tableName).delete().in('id', batchIds)
      }
    }
  }

  console.log(`  Tabla "${tableName}" sincronizada correctamente.`)
}

// ── 2. Listar Archivos con Paginación ───────────────────────
async function listAllFiles(client, bucket) {
  const files = []
  let offset = 0
  const limit = 100

  while (true) {
    const { data, error } = await client
      .storage
      .from(bucket)
      .list('', { limit, offset, sortBy: { column: 'name', order: 'asc' } })

    if (error) throw error
    if (!data || data.length === 0) break

    // Solo conservar archivos reales (no carpetas ni marcadores vacíos)
    for (const item of data) {
      if (item.name && item.id) {
        files.push(item)
      }
    }

    if (data.length < limit) break
    offset += limit
  }

  return files
}

// ── 3. Sincronizar Storage ─────────────────────────────────
async function syncStorage() {
  console.log(`\nSincronizando Storage Bucket: "${STORAGE_BUCKET}"...`)

  let primaryFiles = []
  let backupFiles = []

  try {
    primaryFiles = await listAllFiles(primary, STORAGE_BUCKET)
  } catch (err) {
    console.error(`  Error listando archivos del storage principal:`, err.message)
    return
  }

  try {
    backupFiles = await listAllFiles(backup, STORAGE_BUCKET)
  } catch (err) {
    console.error(`  Error listando archivos del storage de reserva:`, err.message)
    return
  }

  const backupFileNames = new Set(backupFiles.map(f => f.name))
  const filesToSync = primaryFiles.filter(f => !backupFileNames.has(f.name))

  console.log(`  Principal: ${primaryFiles.length} archivos | Reserva: ${backupFiles.length} archivos`)
  console.log(`  Archivos pendientes por copiar a reserva: ${filesToSync.length}`)

  let synced = 0
  let failed = 0

  for (const file of filesToSync) {
    try {
      // Descargar de la principal
      const { data: fileData, error: downloadError } = await primary
        .storage
        .from(STORAGE_BUCKET)
        .download(file.name)

      if (downloadError) throw downloadError

      // Subir a la de reserva
      const { error: uploadError } = await backup
        .storage
        .from(STORAGE_BUCKET)
        .upload(file.name, fileData, {
          contentType: file.metadata?.mimetype || 'image/webp',
          upsert: true
        })

      if (uploadError) throw uploadError

      synced++
      if (synced % 10 === 0 || synced === filesToSync.length) {
        console.log(`  Progreso: ${synced}/${filesToSync.length} imágenes copiadas...`)
      }
    } catch (err) {
      console.error(`  Error al copiar ${file.name}:`, err.message)
      failed++
    }
  }

  console.log(`  Storage sincronizado: ${synced} copiados, ${failed} fallidos.`)
}

// ── Función Principal ──────────────────────────────────────
async function main() {
  console.log('========================================================')
  console.log('Sincronización DB Principal ➔ DB Reserva')
  console.log(`   Principal : ${PRIMARY_URL}`)
  console.log(`   Reserva   : ${BACKUP_URL}`)
  console.log('========================================================')

  // Sincronizar obras (imagen_1, imagen_2, imagen_3)
  await syncTable('obras', ['imagen_1', 'imagen_2', 'imagen_3'])

  // Sincronizar gastronomía (imagen_url)
  await syncTable('menu_gastronomia', ['imagen_url'])

  // Sincronizar bucket de imágenes
  await syncStorage()

  console.log('\n¡Sincronización finalizada con éxito!')
}

main().catch(err => {
  console.error('Error fatal durante la sincronización:', err)
  process.exit(1)
})
