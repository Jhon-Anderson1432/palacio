import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

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
  auth: { persistSession: false },
  realtime: { transport: ws }
})

// Cliente Reserva (Lectura y Escritura)
const backup = createClient(BACKUP_URL, BACKUP_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
})

const STORAGE_BUCKET = 'obras-imagenes'

// Normalización de URLs y Hosts para reemplazo infalible
const cleanPrimary = PRIMARY_URL.trim().replace(/\/+$/, '')
const cleanBackup  = BACKUP_URL.trim().replace(/\/+$/, '')
const primaryHost  = cleanPrimary.replace(/^https?:\/\//, '')
const backupHost   = cleanBackup.replace(/^https?:\/\//, '')

// ── 1. Funciones Auxiliares ──────────────────────────────────

// Paginación segura para obtener todos los registros
async function fetchAllRows(client, tableName, orderCol = 'id') {
  const allRows = []
  let from = 0
  const limit = 1000

  while (true) {
    const { data, error } = await client
      .from(tableName)
      .select('*')
      .order(orderCol, { ascending: true })
      .range(from, from + limit - 1)

    if (error) {
      throw new Error(`Error leyendo "${tableName}": ${error.message}`)
    }

    if (!data || data.length === 0) break
    allRows.push(...data)

    if (data.length < limit) break
    from += limit
  }

  return allRows
}

// Serialización canónica: ordena las claves alfabéticamente para que el orden de las columnas en PostgreSQL no afecte la comparación entre bases de datos
function canonicalStringify(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
  if (Array.isArray(obj)) return `[${obj.map(canonicalStringify).join(',')}]`
  return `{${Object.keys(obj).sort().map(k => `${JSON.stringify(k)}:${canonicalStringify(obj[k])}`).join(',')}}`
}

// Comparación inteligente: solo retorna registros nuevos o modificados
function getChangedRows(sourceRows, destRows) {
  const destMap = new Map(destRows.map(r => [r.id, canonicalStringify(r)]))

  const toUpsert = []
  let newCount = 0
  let modifiedCount = 0
  let skippedCount = 0

  for (const row of sourceRows) {
    const destSnapshot = destMap.get(row.id)
    if (destSnapshot === undefined) {
      toUpsert.push(row)
      newCount++
    } else if (destSnapshot !== canonicalStringify(row)) {
      toUpsert.push(row)
      modifiedCount++
    } else {
      skippedCount++
    }
  }

  return { toUpsert, newCount, modifiedCount, skippedCount }
}

// Reescritura de URLs de imágenes
function rewriteUrls(rows, fields = []) {
  if (!fields.length) return rows
  let replaced = 0

  const processed = rows.map(row => {
    const newRow = { ...row }
    for (const field of fields) {
      if (newRow[field] && typeof newRow[field] === 'string') {
        const original = newRow[field]
        let val = original.replaceAll(cleanPrimary, cleanBackup)
        val = val.replaceAll(primaryHost, backupHost)
        if (original !== val) replaced++
        newRow[field] = val
      }
    }
    return newRow
  })

  if (replaced > 0) {
    console.log(`  ${replaced} URLs de imagenes reescritas hacia la DB de reserva`)
  }

  return processed
}

// Upsert por lotes
async function upsertBatch(tableName, rows) {
  const BATCH_SIZE = 200
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await backup
      .from(tableName)
      .upsert(batch, { onConflict: 'id' })

    if (error) {
      throw new Error(`Error en upsert lote [${i} a ${i + batch.length}] en "${tableName}": ${error.message}`)
    }
  }
}

// ── 2. Sincronizar Tablas ───────────────────────────────────
async function syncTable(tableName, imageFields = []) {
  console.log(`\nSincronizando tabla: "${tableName}"...`)

  // Leer fuente y destino en paralelo
  const [sourceRows, destRows] = await Promise.all([
    fetchAllRows(primary, tableName),
    fetchAllRows(backup, tableName)
  ])
  console.log(`  Principal: ${sourceRows.length} | Reserva: ${destRows.length}`)

  const processedRows = rewriteUrls(sourceRows, imageFields)
  const { toUpsert, newCount, modifiedCount, skippedCount } = getChangedRows(processedRows, destRows)

  if (toUpsert.length === 0) {
    console.log(`  Tabla "${tableName}" ya esta al dia. (${skippedCount} sin cambios)`)
  } else {
    await upsertBatch(tableName, toUpsert)
    console.log(`  Tabla "${tableName}" sincronizada: ${newCount} nuevos, ${modifiedCount} modificados, ${skippedCount} sin cambios.`)
  }

  // Limpiar registros que hayan sido eliminados en la principal
  const primaryIdSet = new Set(sourceRows.map(r => r.id))
  const idsToDelete = destRows.filter(r => !primaryIdSet.has(r.id)).map(r => r.id)

  if (idsToDelete.length > 0) {
    console.log(`  Eliminando ${idsToDelete.length} registros obsoletos en reserva...`)
    for (let i = 0; i < idsToDelete.length; i += 100) {
      const batchIds = idsToDelete.slice(i, i + 100)
      const { error: deleteError } = await backup.from(tableName).delete().in('id', batchIds)
      if (deleteError) {
        console.warn(`  Advertencia borrando registros obsoletos en "${tableName}": ${deleteError.message}`)
      }
    }
  }

  console.log(`  Tabla "${tableName}" procesada correctamente.`)
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
