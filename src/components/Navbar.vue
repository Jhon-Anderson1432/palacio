<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-12 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 md:grid md:grid-cols-3 md:gap-0">
      
      <div class="flex-shrink-0 md:justify-start">
        <router-link to="/" class="transition-transform duration-300 hover:scale-105 block">
          <img src="../assets/logon.png" alt="Palacio Nacional" class="h-9 md:h-12 w-auto" />
        </router-link>
      </div>

      <div class="flex-1 md:w-full flex justify-center">
        <div class="relative group w-full max-w-md md:max-w-2xl">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar..." 
            class="w-full bg-white/10 border border-white/20 rounded-full py-2 md:py-3 px-5 text-white text-xs md:text-base outline-none transition-all duration-300 focus:bg-white/20 focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10 placeholder:text-white/40"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 group-focus-within:text-yellow-500 transition-all text-sm md:text-lg">
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