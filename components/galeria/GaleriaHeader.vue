<template>
  <div>
    <header class="text-center max-w-4xl mx-auto mt-6 mb-8 flex flex-col items-center">
      <h1 class="text-3xl md:text-5xl font-serif text-[#D4AF37] uppercase tracking-[0.15em] drop-shadow-lg mb-4">
        {{ t.seoTitle }}
      </h1>
      <p class="text-neutral-400 text-xs md:text-sm tracking-[0.2em] uppercase font-light max-w-2xl">
        {{ t.seoSubtitle }}
      </p>
    </header>

    <div class="w-full flex justify-center mb-8">
      <NuxtImg 
        src="/logon.png" 
        alt="Logotipo Galería de Arte Palacio Nacional Medellín" 
        class="w-36 md:w-44 object-contain opacity-90 drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
        preload
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  t: {
    type: Object,
    required: true
  }
})
</script>
