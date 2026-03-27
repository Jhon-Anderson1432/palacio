<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10 px-6 md:px-16 py-4 md:py-3">
    
    <div class="max-w-7xl mx-auto flex flex-col items-center gap-4 md:grid md:grid-cols-3 md:gap-0">
      
      <div class="flex justify-center md:justify-start w-full md:pl-4">
        <router-link to="/" class="transition-transform duration-300 hover:scale-105">
          <img src="../assets/logon.png" alt="Palacio Nacional" class="h-10 md:h-12 w-auto" />
        </router-link>
      </div>

      <div class="w-full flex justify-center">
        <div class="relative group w-[95%] sm:w-full max-w-md md:max-w-2xl">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar autor, obra o técnica..." 
            class="w-full bg-white/10 border border-white/20 rounded-full py-3 px-6 text-white text-sm md:text-base outline-none transition-all duration-300 focus:bg-white/20 focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 placeholder:italic placeholder:text-white/40"
          />
          <span class="absolute right-5 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 group-focus-within:text-yellow-500 transition-all text-lg">
            🔍
          </span>
        </div>
      </div>

      <div class="hidden md:block"></div>

    </div>
  </nav>
</template>

<script setup>
import { searchQuery } from '../lib/supabase.js'
</script>

<style scoped>
.group:hover input {
  border-color: rgba(255, 255, 255, 0.4);
}
</style>