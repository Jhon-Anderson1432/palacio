export default defineNuxtPlugin((nuxtApp) => {

    if ((globalThis as any).__failover_installed) return
    (globalThis as any).__failover_installed = true

    const config = useRuntimeConfig();
    const activeUrl = config.public.supabase.url
    const backupUrl = config.public.backupDB.url
    const backupKey = config.public.backupDB.key

    // Si el switch esta activo o si faltan la variables del backup no activa la reserva
    if (!backupUrl || !backupKey || activeUrl === backupUrl) return
    
    const originalFetch = globalThis.fetch

    globalThis.fetch = async (input, init) => {
        let url = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : (input as Request).url)

        if (!url || !url.startsWith(activeUrl)) return originalFetch(input, init)

        try {
            const response = await originalFetch(input, init)

            if (response.status >= 500) throw new Error("Base de datos principal caida")
            return response
        
        } catch (error) {
            console.warn("Activando failover...")

            const newUrl = url.replace(activeUrl, backupUrl)
            const newHeaders = new Headers(init?.headers)

            if (newHeaders.has('apikey')) newHeaders.set('apikey', backupKey)

            if (newHeaders.has('Authorization')) newHeaders.set('Authorization', `Bearer ${backupKey}`)
            
            return originalFetch(newUrl, {
                ...init,
                headers: newHeaders
            })
        }
    }
})