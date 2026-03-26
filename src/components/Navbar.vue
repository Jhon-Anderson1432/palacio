<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-lg border-b border-white/10 px-4 md:px-6 py-3">
    
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <router-link to="/" class="flex-shrink-0 transition-transform duration-300 hover:scale-105">
        <img src="../assets/logon.png" alt="Palacio Nacional" class="h-10 md:h-12 w-auto" />
      </router-link>

      <div class="flex-1 max-w-md relative group">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Buscar..." 
          class="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-4 pr-10 text-white text-xs md:text-sm outline-none transition-all duration-300 focus:bg-white/20 focus:border-yellow-500/50 focus:ring-4 focus:ring-yellow-500/10"
        />
        <span class="absolute right-3 top-2 md:top-2.5 opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none">
          🔍
        </span>
      </div>

      <div class="flex-shrink-0">
        <router-link 
          to="/exposiciones" 
          class="text-white text-xs md:text-sm font-medium transition-all duration-300 hover:text-yellow-500 relative group uppercase tracking-widest"
        >
          <span class="hidden sm:inline">Galería</span>
          <span class="sm:hidden">🖼️</span> <span class="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-yellow-500 transition-all duration-300 group-hover:w-full"></span>
        </router-link>
      </div>
    </div>

  </nav>
</template>

<script setup>
// Ahora lo importamos desde nuestra librería de Supabase
import { searchQuery } from '../lib/supabase.js'
</script>

<style scoped>
input:focus + span {
  opacity: 1;
  color: #eab308;
}
</style>