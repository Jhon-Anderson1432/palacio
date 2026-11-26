<template>
  <header class="relative z-10 pt-32 md:pt-40 pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center w-full">

    <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide text-white uppercase mb-5 leading-tight drop-shadow-md">
      {{ t.title }}
    </h1>

    <p class="text-xs sm:text-sm md:text-base text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
      {{ t.subtitle }}
    </p>
  </header>
</template>

<script setup>
defineProps({
  t: {
    type: Object,
    required: true
  }
})
</script>
