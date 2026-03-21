<template>
  <div id="app-root">
    
    <Navbar v-if="$route.name !== 'DetalleObra'" />
    
    <main>
      <router-view />
    </main>

  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue' // Asegúrate de que la ruta sea correcta
import { useRoute } from 'vue-router'

const route = useRoute()
</script>