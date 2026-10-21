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

// Normalización de URLs y Hosts
const cleanPrimary = PRIMARY_URL.trim().replace(/\/+$/, '')
const cleanBackup  = BACKUP_URL.trim().replace(/\/+$/, '')
const primaryHost  = cleanPrimary.replace(/^https?:\/\//, '')
const backupHost   = cleanBackup.replace(/^https?:\/\//, '')

const primary = createClient(PRIMARY_URL, PRIMARY_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
})

const backup = createClient(BACKUP_URL, BACKUP_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
})

const STORAGE_BUCKET = 'obras-imagenes'

// ── 1. Sincronización de Autenticación (auth.users) ─────────
async function syncAuthUsers() {
  console.log('\nSincronizando Usuarios de Autenticación (auth.users)...')

  // Intentamos primero con la función RPC para preservar contraseñas exactas
  const { data: usersRpc, error: rpcError } = await primary.rpc('get_auth_users_for_sync')

  if (!rpcError && usersRpc && Array.isArray(usersRpc)) {
    console.log(`  ${usersRpc.length} usuarios leídos vía función RPC de la DB principal`)

    const { data: syncResult, error: syncError } = await backup.rpc('sync_auth_users_from_json', {
      users_data: usersRpc
    })

    if (syncError) {
      throw new Error(`Error insertando usuarios en reserva vía RPC: ${syncError.message}`)
    }

    console.log(`  ${syncResult?.count || usersRpc.length} usuarios y contraseñas sincronizados exitosamente en auth.users`)
    return
  }

  // Fallback mediante API Admin (si aún no se ha ejecutado el SQL en Supabase)
  console.log('  Aviso: Función RPC no detectada, utilizando API Admin como respaldo...')
  const { data: { users }, error: listError } = await primary.auth.admin.listUsers({ page: 1, perPage: 1000 })

  if (listError) {
    throw new Error(`Error listando usuarios con API Admin: ${listError.message}`)
  }

  console.log(`  ${users.length} usuarios encontrados vía API Admin`)
  let count = 0

  for (const user of users) {
    try {
      const { error: createError } = await backup.auth.admin.createUser({
        id: user.id,
        email: user.email,
        email_confirm: true,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata
      })

      if (!createError || createError.message?.includes('already been registered')) {
        count++
      } else {
        console.warn(`  Advertencia al registrar usuario ${user.email}: ${createError.message}`)
      }
    } catch (e) {
      console.warn(`  Advertencia procesando ${user.email}: ${e.message}`)
    }
  }

  console.log(`  ${count} usuarios verificados en auth.users de reserva`)
}

// ── 2. Funciones Auxiliares para Tablas ─────────────────────

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
      throw new Error(`Error leyendo "${tableName}" en la DB principal: ${error.message}`)
    }

    if (!data || data.length === 0) break
    allRows.push(...data)

    if (data.length < limit) break
    from += limit
  }

  return allRows
}

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
    console.log(`  ${replaced} URLs de imágenes reescritas hacia la DB de reserva`)
  }

  return processed
}

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

async function deleteObsolete(tableName, primaryIds) {
  const { data: backupRows, error: checkError } = await backup
    .from(tableName)
    .select('id')

  if (checkError) {
    console.warn(`  Advertencia verificando registros en "${tableName}": ${checkError.message}`)
    return
  }

  if (backupRows && backupRows.length > 0) {
    const primaryIdSet = new Set(primaryIds)
    const idsToDelete = backupRows.filter(r => !primaryIdSet.has(r.id)).map(r => r.id)

    if (idsToDelete.length > 0) {
      console.log(`  Eliminando ${idsToDelete.length} registros obsoletos en "${tableName}"...`)
      for (let i = 0; i < idsToDelete.length; i += 100) {
        const batchIds = idsToDelete.slice(i, i + 100)
        const { error: deleteError } = await backup.from(tableName).delete().in('id', batchIds)
        if (deleteError) {
          console.warn(`  Advertencia borrando en "${tableName}": ${deleteError.message}`)
        }
      }
    }
  }
}

// Comparación inteligente: solo retorna registros nuevos o modificados
function getChangedRows(sourceRows, destRows) {
  const destMap = new Map(destRows.map(r => [r.id, JSON.stringify(r)]))

  const toUpsert = []
  let newCount = 0
  let modifiedCount = 0
  let skippedCount = 0

  for (const row of sourceRows) {
    const destSnapshot = destMap.get(row.id)
    if (destSnapshot === undefined) {
      toUpsert.push(row)
      newCount++
    } else if (destSnapshot !== JSON.stringify(row)) {
      toUpsert.push(row)
      modifiedCount++
    } else {
      skippedCount++
    }
  }

  return { toUpsert, newCount, modifiedCount, skippedCount }
}

async function syncTable(tableName, imageFields = [], orderCol = 'id') {
  console.log(`\nSincronizando tabla: "${tableName}"...`)

  const [sourceRows, destRows] = await Promise.all([
    fetchAllRows(primary, tableName, orderCol),
    fetchAllRows(backup, tableName, orderCol)
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

  return sourceRows.map(r => r.id)
}

// ── 3. Sincronización de Storage ───────────────────────────

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

async function syncStorage() {
  console.log(`\nSincronizando Storage Bucket: "${STORAGE_BUCKET}"...`)

  let primaryFiles = []
  let backupFiles = []

  try {
    primaryFiles = await listAllFiles(primary, STORAGE_BUCKET)
    backupFiles = await listAllFiles(backup, STORAGE_BUCKET)
  } catch (err) {
    console.error(`  Error listando archivos de storage:`, err.message)
    return
  }

  const backupFileNames = new Set(backupFiles.map(f => f.name))
  const filesToSync = primaryFiles.filter(f => !backupFileNames.has(f.name))

  console.log(`  Principal: ${primaryFiles.length} archivos | Reserva: ${backupFiles.length} archivos`)
  console.log(`  Archivos pendientes por copiar: ${filesToSync.length}`)

  let synced = 0
  let failed = 0

  for (const file of filesToSync) {
    try {
      const { data: fileData, error: downloadError } = await primary
        .storage
        .from(STORAGE_BUCKET)
        .download(file.name)

      if (downloadError) throw downloadError

      const { error: uploadError } = await backup
        .storage
        .from(STORAGE_BUCKET)
        .upload(file.name, fileData, {
          contentType: file.metadata?.mimetype || 'image/webp',
          upsert: true
        })

      if (uploadError) throw uploadError
      synced++
    } catch (err) {
      console.warn(`  Advertencia al copiar ${file.name}: ${err.message}`)
      failed++
    }
  }

  console.log(`  Storage sincronizado: ${synced} nuevos copiados, ${failed} fallidos.`)
}

// ── Ejecución Principal General ─────────────────────────────
async function main() {
  const startTime = Date.now()
  console.log('========================================================')
  console.log('Sincronización General Completa (Principal -> Reserva)')
  console.log(`Fecha/Hora: ${new Date().toISOString()}`)
  console.log('========================================================')

  // 1. Usuarios de Autenticación
  await syncAuthUsers()

  // 2. Perfiles de usuario (depende de auth.users)
  const perfilesIds = await syncTable('perfiles', [], 'id')

  // 3. Seguridad y Vigilancia (puntos de control, rondas y registros)
  const puntosControlIds = await syncTable('puntos_control', [], 'id')
  const rondasVigIds = await syncTable('rondas_vigilancia', [], 'id')
  const registrosVigIds = await syncTable('registros_punto_control', [], 'id')

  // 4. Catálogo Cultural, Auditoría y Gastronomía
  const obrasIds = await syncTable('obras', ['imagen_1', 'imagen_2', 'imagen_3'], 'id')
  const logsGaleriaIds = await syncTable('logs_galeria', [], 'id')
  const menuIds = await syncTable('menu_gastronomia', ['imagen_url'], 'id')

  // 5. Sistema POS
  const ordenesIds = await syncTable('pos_ordenes', [], 'id')
  const itemsIds = await syncTable('pos_orden_items', [], 'id')

  // 6. Limpieza de Registros Eliminados (en orden inverso de dependencias)
  console.log('\nVerificando y limpiando registros eliminados...')
  await deleteObsolete('pos_orden_items', itemsIds)
  await deleteObsolete('pos_ordenes', ordenesIds)
  await deleteObsolete('registros_punto_control', registrosVigIds)
  await deleteObsolete('rondas_vigilancia', rondasVigIds)
  await deleteObsolete('puntos_control', puntosControlIds)
  await deleteObsolete('logs_galeria', logsGaleriaIds)
  await deleteObsolete('menu_gastronomia', menuIds)
  await deleteObsolete('obras', obrasIds)
  await deleteObsolete('perfiles', perfilesIds)

  // 7. Sincronización de Imágenes en Storage
  await syncStorage()

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\n¡Sincronización General Completa finalizada con éxito en ${duration}s!`)
}

main().catch(err => {
  console.error('Error fatal durante la sincronización general:', err)
  process.exit(1)
})
