<template>
  <div id="app-root">
    
    <Navbar v-if="$route.name !== 'Home' && $route.name !== 'DetalleObra' && $route.name !== 'HomeGastro' && $route.name !== 'ChaoCafe'" />    
    
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