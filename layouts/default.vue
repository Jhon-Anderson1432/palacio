<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    
    <!-- Aquí es donde Nuxt inyectará el contenido de tus páginas (como el index) -->
    <main class="flex-1 w-full h-full relative flex flex-col pt-16">
      <slot />
    </main>

    <Footer />
  </div>
</template>