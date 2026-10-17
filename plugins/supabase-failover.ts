export default defineNuxtPlugin((nuxtApp) => {

    if ((globalThis as any).__failover_installed) return
    (globalThis as any).__failover_installed = true

    const config = useRuntimeConfig()
    const publicConfig = config.public as any
    const activeUrl: string = publicConfig.supabase?.url
    const backupUrl: string = publicConfig.backupDB?.url
    const backupKey: string = publicConfig.backupDB?.key
    const primaryUrl: string = publicConfig.primaryUrl || activeUrl

    // Si faltan las variables de la base de reserva, no intervenimos
    if (!backupUrl || !backupKey) return

    const isManualSwitch = activeUrl === backupUrl
    const originalFetch = globalThis.fetch

    // Función auxiliar: reescribe las URLs del storage principal por las del storage de reserva
    function rewriteStorageUrls(body: string): string {
        if (!primaryUrl || !backupUrl || primaryUrl === backupUrl) return body
        return body.replaceAll(primaryUrl, backupUrl)
    }

    globalThis.fetch = async (input, init) => {
        let url = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : (input as Request).url)

        if (!url || !url.startsWith(activeUrl)) return originalFetch(input, init)

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
                    return new Response(rewrittenBody, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.headers
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
        // Nuxt apunta a la DB principal. Si falla con error >= 500 o error de red,
        // reintentamos automáticamente contra la de reserva y reescribimos las URLs.
        try {
            const response = await originalFetch(input, init)

            if (response.status >= 500) throw new Error("Base de datos principal caída")
            return response

        } catch (error) {
            console.warn("Activando failover automático a base de datos de reserva...")

            const newUrl = url.replace(activeUrl, backupUrl)
            const newHeaders = new Headers(init?.headers)

            if (newHeaders.has('apikey')) newHeaders.set('apikey', backupKey)
            if (newHeaders.has('Authorization')) newHeaders.set('Authorization', `Bearer ${backupKey}`)

            const backupResponse = await originalFetch(newUrl, {
                ...init,
                headers: newHeaders
            })

            const contentType = backupResponse.headers.get('content-type') || ''
            if (contentType.includes('application/json')) {
                const originalBody = await backupResponse.text()
                const rewrittenBody = rewriteStorageUrls(originalBody)

                return new Response(rewrittenBody, {
                    status: backupResponse.status,
                    statusText: backupResponse.statusText,
                    headers: backupResponse.headers
                })
            }

            return backupResponse
        }
    }
})