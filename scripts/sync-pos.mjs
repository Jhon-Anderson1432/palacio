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

// Normalización de URLs y Hosts para URLs de imágenes
const cleanPrimary = PRIMARY_URL.trim().replace(/\/+$/, '')
const cleanBackup  = BACKUP_URL.trim().replace(/\/+$/, '')
const primaryHost  = cleanPrimary.replace(/^https?:\/\//, '')
const backupHost   = cleanBackup.replace(/^https?:\/\//, '')

// Clientes Supabase con service_role
const primary = createClient(PRIMARY_URL, PRIMARY_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
})

const backup = createClient(BACKUP_URL, BACKUP_KEY, {
  auth: { persistSession: false },
  realtime: { transport: ws }
})

// ── Funciones Auxiliares ───────────────────────────────────

// Paginación segura para obtener todos los registros sin tope de 1000
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

// Reescritura de URLs de imágenes
function rewriteUrls(rows, fields = []) {
  if (!fields.length) return rows
  return rows.map(row => {
    const newRow = { ...row }
    for (const field of fields) {
      if (newRow[field] && typeof newRow[field] === 'string') {
        let val = newRow[field]
        val = val.replaceAll(cleanPrimary, cleanBackup)
        val = val.replaceAll(primaryHost, backupHost)
        newRow[field] = val
      }
    }
    return newRow
  })
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

// Limpieza de registros obsoletos
async function deleteObsolete(tableName, primaryIds) {
  const { data: backupRows, error: checkError } = await backup
    .from(tableName)
    .select('id')

  if (checkError) {
    console.warn(`  Advertencia verificando "${tableName}" en reserva: ${checkError.message}`)
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
          console.warn(`  Advertencia al borrar en "${tableName}": ${deleteError.message}`)
        }
      }
    }
  }
}

// Sincronizar tabla individual
async function syncTable(tableName, imageFields = [], orderCol = 'id') {
  console.log(`\nSincronizando tabla: "${tableName}"...`)
  const rows = await fetchAllRows(primary, tableName, orderCol)
  console.log(`  ${rows.length} registros obtenidos de la DB principal`)

  const processedRows = rewriteUrls(rows, imageFields)
  await upsertBatch(tableName, processedRows)
  console.log(`  Tabla "${tableName}" sincronizada exitosamente.`)

  return rows.map(r => r.id)
}

// Sincronización de Autenticación previa para garantizar foreign keys de perfiles
async function syncAuthUsers() {
  console.log('\nSincronizando Usuarios de Autenticación (auth.users)...')

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

  // Fallback mediante API Admin
  console.log('  Aviso: Función RPC no detectada, utilizando API Admin como respaldo...')
  const { data: { users }, error: listError } = await primary.auth.admin.listUsers({ page: 1, perPage: 1000 })

  if (listError) {
    throw new Error(`Error listando usuarios con API Admin: ${listError.message}`)
  }

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
      }
    } catch (e) {
      // Ignorar si ya existe
    }
  }
  console.log(`  ${count} usuarios verificados en auth.users de reserva`)
}

// ── Ejecución Principal del POS ─────────────────────────────
async function main() {
  const startTime = Date.now()
  console.log('========================================================')
  console.log('Sincronización del Sistema POS (Principal -> Reserva)')
  console.log(`Fecha/Hora: ${new Date().toISOString()}`)
  console.log('========================================================')

  // ORDEN ESTRICTO DE INSERCIÓN (Para no violar claves foráneas):
  // 0. auth.users (Garantiza que existan los usuarios para perfiles)
  await syncAuthUsers()

  // 1. perfiles (meseras / cajeras que atienden mesas)
  const perfilesIds = await syncTable('perfiles', [], 'id')

  // 2. menu_gastronomia (platos y bebidas que se piden en las órdenes)
  const menuIds = await syncTable('menu_gastronomia', ['imagen_url'], 'id')

  // 3. pos_ordenes (órdenes de mesa)
  const ordenesIds = await syncTable('pos_ordenes', [], 'id')

  // 4. pos_orden_items (ítems individuales de cada comanda)
  const itemsIds = await syncTable('pos_orden_items', [], 'id')

  // ORDEN INVERSO DE LIMPIEZA (Para no violar claves foráneas al borrar):
  console.log('\nVerificando y limpiando registros eliminados...')
  await deleteObsolete('pos_orden_items', itemsIds)
  await deleteObsolete('pos_ordenes', ordenesIds)
  await deleteObsolete('menu_gastronomia', menuIds)
  await deleteObsolete('perfiles', perfilesIds)

  const duration = ((Date.now() - startTime) / 1000).toFixed(2)
  console.log(`\n¡Sincronización del Sistema POS completada con éxito en ${duration}s!`)
}

main().catch(err => {
  console.error('Error fatal durante la sincronización del POS:', err)
  process.exit(1)
})
