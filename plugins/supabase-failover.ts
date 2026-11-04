export default defineNuxtPlugin((nuxtApp) => {

    if ((globalThis as any).__failover_installed) return
    (globalThis as any).__failover_installed = true

    const config = useRuntimeConfig()
    const publicConfig = config.public as any
    const activeUrl: string = publicConfig.supabase?.url
    const activeKey: string = publicConfig.supabase?.key
    const backupUrl: string = publicConfig.backupDB?.url
    const backupKey: string = publicConfig.backupDB?.key
    const primaryUrl: string = publicConfig.primaryUrl || activeUrl

    // Si faltan las variables de la base de reserva, no intervenimos
    if (!backupUrl || !backupKey) return

    const isManualSwitch = activeUrl === backupUrl
    const originalFetch = globalThis.fetch

    // Estado del Circuit Breaker en memoria
    let isPrimaryDown = false
    let primaryDownUntil = 0
    const FAILOVER_COOLDOWN_MS = 60_000 // 60 segundos de gracia antes de reintentar la principal

    // Función auxiliar: reescribe las URLs del storage principal por las del storage de reserva
    function rewriteStorageUrls(body: string): string {
        if (!primaryUrl || !backupUrl || primaryUrl === backupUrl) return body
        return body.replaceAll(primaryUrl, backupUrl)
    }

    // Determina si un código HTTP representa indisponibilidad o límite de cuota
    function isServiceUnavailable(status: number): boolean {
        return status >= 500 || status === 402 || status === 429
    }

    // Ejecuta una petición contra la base de datos de reserva adaptando URLs y credenciales
    async function executeBackupFetch(targetUrl: string, init?: RequestInit): Promise<Response> {
        const newUrl = targetUrl.replace(activeUrl, backupUrl)
        const newHeaders = new Headers(init?.headers)

        // Siempre sustituimos el apikey por la clave del proyecto de reserva
        newHeaders.set('apikey', backupKey)

        const authHeader = newHeaders.get('Authorization')
        const isAnon = !authHeader || 
                       (activeKey && authHeader.includes(activeKey)) || 
                       (backupKey && authHeader.includes(backupKey))

        if (isAnon) {
            newHeaders.set('Authorization', `Bearer ${backupKey}`)
        }

        const backupResponse = await originalFetch(newUrl, {
            ...init,
            headers: newHeaders
        })

        const contentType = backupResponse.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
            const originalBody = await backupResponse.text()
            const rewrittenBody = rewriteStorageUrls(originalBody)

            const responseHeaders = new Headers(backupResponse.headers)
            responseHeaders.delete('content-encoding')
            responseHeaders.delete('content-length')

            return new Response(rewrittenBody, {
                status: backupResponse.status,
                statusText: backupResponse.statusText,
                headers: responseHeaders
            })
        }

        return backupResponse
    }

    globalThis.fetch = async (input, init) => {
        let url = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : (input as Request).url)

        if (!url || !url.startsWith(activeUrl)) return originalFetch(input, init)

        // Preservar configuración si el input es un Request nativo
        let effectiveInit = init
        if (input instanceof Request) {
            effectiveInit = {
                method: init?.method || input.method,
                headers: init?.headers || input.headers,
                body: init?.body,
                ...init
            }
        }

        // ── CASO 1: Switch Manual Activo (USE_BACKUP=true) ───────────────────────
        // Nuxt ya apunta a la DB de reserva. Solo aseguramos que si alguna respuesta JSON
        // contiene URLs apuntando al storage del proyecto principal, se reescriban al de reserva.
        if (isManualSwitch) {
            const response = await originalFetch(input, init)
            const contentType = response.headers.get('content-type') || ''

            if (contentType.includes('application/json') && primaryUrl !== backupUrl) {
                const originalBody = await response.text()
                if (originalBody.includes(primaryUrl)) {
                    const rewrittenBody = rewriteStorageUrls(originalBody)
                    const responseHeaders = new Headers(response.headers)
                    responseHeaders.delete('content-encoding')
                    responseHeaders.delete('content-length')

                    return new Response(rewrittenBody, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: responseHeaders
                    })
                }
                return new Response(originalBody, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                })
            }
            return response
        }

        // ── CASO 2: Modo Automático Normal (USE_BACKUP=false) ────────────────────
        const now = Date.now()

        // Si el Circuit Breaker está activo (la principal falló hace menos de 60s), ir directo a reserva
        if (isPrimaryDown && now < primaryDownUntil) {
            return executeBackupFetch(url, effectiveInit)
        }

        // Si no, intentar con la base de datos principal
        try {
            const response = await originalFetch(input, init)

            // Si la principal responde con error de cuota (402), saturación (429) o error de servidor (>=500 / 540)
            if (isServiceUnavailable(response.status)) {
                console.warn(`Base principal no disponible. Activando failover automático a base de reserva por 60s...`)
                isPrimaryDown = true
                primaryDownUntil = Date.now() + FAILOVER_COOLDOWN_MS

                return await executeBackupFetch(url, effectiveInit)
            }

            // Si respondió exitosamente y venía de estar caída, restauramos el estado normal (failback)
            if (isPrimaryDown) {
                console.info('Base de datos principal restablecida. Tráfico restaurado a normal.')
                isPrimaryDown = false
                primaryDownUntil = 0
            }

            return response

        } catch (error) {
            // Error de red, DNS o fallo de conexión
            console.warn('Fallo de conexión o red con la base principal. Activando failover automático a base de reserva por 60s...', error)
            isPrimaryDown = true
            primaryDownUntil = Date.now() + FAILOVER_COOLDOWN_MS

            return await executeBackupFetch(url, effectiveInit)
        }
    }
})
