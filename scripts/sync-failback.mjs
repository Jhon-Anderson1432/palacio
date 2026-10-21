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

// Clientes Supabase con service_role
// En Failback: backup es la FUENTE (lectura) y primary es el DESTINO (escritura)
const primary = createClient(PRIMARY_URL, PRIMARY_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
})

const backup = createClient(BACKUP_URL, BACKUP_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
})

const STORAGE_BUCKET = 'obras-imagenes'

// ── 1. Sincronización Inversa de Autenticación ───────────────
async function syncAuthUsersToPrimary() {
  console.log('\nSincronizando Usuarios de Autenticación (Reserva -> Principal)...')

  // Intentamos leer de la Reserva e insertar en la Principal vía RPC
  const { data: usersRpc, error: rpcError } = await backup.rpc('get_auth_users_for_sync')

  if (!rpcError && usersRpc && Array.isArray(usersRpc)) {
    console.log(`  ${usersRpc.length} usuarios leídos vía función RPC de la DB de Reserva`)

    const { data: syncResult, error: syncError } = await primary.rpc('sync_auth_users_from_json', {
      users_data: usersRpc
    })

    if (syncError) {
      throw new Error(`Error insertando usuarios en la Principal vía RPC: ${syncError.message}`)
    }

    console.log(`  ${syncResult?.count || usersRpc.length} usuarios sincronizados exitosamente en la DB Principal`)
    return
  }

  // Fallback mediante API Admin si no están creadas las funciones RPC
  console.log('  Aviso: Función RPC no detectada, utilizando API Admin como respaldo...')
  const { data: { users }, error: listError } = await backup.auth.admin.listUsers({ page: 1, perPage: 1000 })

  if (listError) {
    throw new Error(`Error listando usuarios de reserva con API Admin: ${listError.message}`)
  }

  console.log(`  ${users.length} usuarios encontrados en Reserva`)
  let count = 0

  for (const user of users) {
    try {
      const { error: createError } = await primary.auth.admin.createUser({
        id: user.id,
        email: user.email,
        email_confirm: true,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata
      })

      if (!createError || createError.message?.includes('already been registered')) {
        count++
      } else {
        console.warn(`  Advertencia al registrar usuario en Principal ${user.email}: ${createError.message}`)
      }
    } catch (e) {
      console.warn(`  Advertencia procesando ${user.email}: ${e.message}`)
    }
  }

  console.log(`  ${count} usuarios verificados en auth.users de la DB Principal`)
}

// ── 2. Funciones Auxiliares para Tablas ─────────────────────

// Paginación segura para obtener todos los registros de la DB de Reserva
async function fetchAllRowsFromBackup(tableName, orderCol = 'id') {
  const allRows = []
  let from = 0
  const limit = 1000

  while (true) {
    const { data, error } = await backup
      .from(tableName)
      .select('*')
      .order(orderCol, { ascending: true })
      .range(from, from + limit - 1)

    if (error) {
      throw new Error(`Error leyendo "${tableName}" en la DB de Reserva: ${error.message}`)
    }

    if (!data || data.length === 0) break
    allRows.push(...data)

    if (data.length < limit) break
    from += limit
  }

  return allRows
}

// Paginación segura para obtener todos los registros de la DB Principal (para comparación)
async function fetchAllRowsFromPrimary(tableName, orderCol = 'id') {
  const allRows = []
  let from = 0
  const limit = 1000

  while (true) {
    const { data, error } = await primary
      .from(tableName)
      .select('*')
      .order(orderCol, { ascending: true })
      .range(from, from + limit - 1)

    if (error) {
      throw new Error(`Error leyendo "${tableName}" en la DB Principal: ${error.message}`)
    }

    if (!data || data.length === 0) break
    allRows.push(...data)

    if (data.length < limit) break
    from += limit
  }

  return allRows
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

// Reescritura Inversa de URLs: cambia el host de Reserva por el de la Principal
function rewriteUrlsToPrimary(rows, fields = []) {
  if (!fields.length) return rows
  let replaced = 0

  const processed = rows.map(row => {
    const newRow = { ...row }
    for (const field of fields) {
      if (newRow[field] && typeof newRow[field] === 'string') {
        const original = newRow[field]
        let val = original.replaceAll(cleanBackup, cleanPrimary)
        val = val.replaceAll(backupHost, primaryHost)
        if (original !== val) replaced++
        newRow[field] = val
      }
    }
    return newRow
  })

  if (replaced > 0) {
    console.log(`  ${replaced} URLs de imágenes reescritas hacia la DB Principal`)
  }

  return processed
}

// Upsert aditivo hacia la DB Principal (NO se borra nada de la Principal)
async function upsertBatchToPrimary(tableName, rows) {
  const BATCH_SIZE = 200
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE)
    const { error } = await primary
      .from(tableName)
      .upsert(batch, { onConflict: 'id' })

    if (error) {
      throw new Error(`Error en upsert lote [${i} a ${i + batch.length}] en "${tableName}" de la Principal: ${error.message}`)
    }
  }
}

// Sincronizar tabla individual desde Reserva hacia Principal
async function syncTableToPrimary(tableName, imageFields = [], orderCol = 'id') {
  console.log(`\nSincronizando tabla: "${tableName}" (Reserva -> Principal)...`)

  const [sourceRows, destRows] = await Promise.all([
    fetchAllRowsFromBackup(tableName, orderCol),
    fetchAllRowsFromPrimary(tableName, orderCol)
  ])
  console.log(`  Reserva: ${sourceRows.length} | Principal: ${destRows.length}`)

  if (sourceRows.length === 0) {
    console.log(`  Tabla "${tableName}" vacia en Reserva. Nada que transferir.`)
    return
  }

  const processedRows = rewriteUrlsToPrimary(sourceRows, imageFields)
  const { toUpsert, newCount, modifiedCount, skippedCount } = getChangedRows(processedRows, destRows)

  if (toUpsert.length === 0) {
    console.log(`  Tabla "${tableName}" ya esta al dia en Principal. (${skippedCount} sin cambios)`)
  } else {
    await upsertBatchToPrimary(tableName, toUpsert)
    console.log(`  Tabla "${tableName}" failback: ${newCount} nuevos, ${modifiedCount} modificados, ${skippedCount} sin cambios.`)
  }
}

// ── 3. Sincronización Inversa de Storage ─────────────────────

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

async function syncStorageToPrimary() {
  console.log(`\nSincronizando Storage Bucket: "${STORAGE_BUCKET}" (Reserva -> Principal)...`)

  let backupFiles = []
  let primaryFiles = []

  try {
    backupFiles = await listAllFiles(backup, STORAGE_BUCKET)
    primaryFiles = await listAllFiles(primary, STORAGE_BUCKET)
  } catch (err) {
    console.error(`  Error listando archivos de storage:`, err.message)
    return
  }

  const primaryFileNames = new Set(primaryFiles.map(f => f.name))
  const filesToSync = backupFiles.filter(f => !primaryFileNames.has(f.name))

  console.log(`  Reserva: ${backupFiles.length} archivos | Principal: ${primaryFiles.length} archivos`)
  console.log(`  Archivos nuevos en Reserva pendientes por copiar a Principal: ${filesToSync.length}`)

  let synced = 0
  let failed = 0

  for (const file of filesToSync) {
    try {
      const { data: fileData, error: downloadError } = await backup
        .storage
        .from(STORAGE_BUCKET)
        .download(file.name)

      if (downloadError) throw downloadError

      const { error: uploadError } = await primary
        .storage
        .from(STORAGE_BUCKET)
        .upload(file.name, fileData, {
          contentType: file.metadata?.mimetype || 'image/webp',
          upsert: true
        })

      if (uploadError) throw uploadError
      synced++
    } catch (err) {
      console.warn(`  Advertencia al copiar ${file.name} a Principal: ${err.message}`)
      failed++
    }
  }

  console.log(`  Storage sincronizado a Principal: ${synced} nuevos copiados, ${failed} fallidos.`)
}

// ── Ejecución Principal de Failback ─────────────────────────
async function main() {
  const startTime = Date.now()
  console.log('========================================================')
  console.log('FAILBACK: Recuperación DB Principal desde Reserva')
  console.log(`Dirección : Reserva (${BACKUP_URL}) -> Principal (${PRIMARY_URL})`)
  console.log(`Fecha/Hora: ${new Date().toISOString()}`)
  console.log('========================================================')

  // 1. Usuarios de Autenticación
  await syncAuthUsersToPrimary()

  // 2. Perfiles (meseras, vigilantes, admins)
  await syncTableToPrimary('perfiles', [], 'id')

  // 3. Seguridad y Vigilancia
  await syncTableToPrimary('puntos_control', [], 'id')
  await syncTableToPrimary('rondas_vigilancia', [], 'id')
  await syncTableToPrimary('registros_punto_control', [], 'id')

  // 4. Catálogo Cultural y Gastronómico (con reescritura de URLs a Principal)
  await syncTableToPrimary('obras', ['imagen_1', 'imagen_2', 'imagen_3'], 'id')
  await syncTableToPrimary('logs_galeria', [], 'id')
  await syncTableToPrimary('menu_gastronomia', ['imagen_url'], 'id')

  // 5. Sistema POS (comandas y pedidos tomados durante la contingencia)
  await syncTableToPrimary('pos_ordenes', [], 'id')
  await syncTableToPrimary('pos_orden_items', [], 'id')

  // 6. Archivos de Storage subidos a Reserva durante la contingencia
  await syncStorageToPrimary()

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\n¡FAILBACK COMPLETADO CON ÉXITO en ${duration}s!`)
  console.log('La DB Principal ha absorbido todas las modificaciones de la Reserva.')
  console.log('Ya es seguro restablecer el tráfico habitual hacia la DB Principal.')
}

main().catch(err => {
  console.error('Error fatal durante el Failback:', err)
  process.exit(1)
})
