<template>
  <div id="app-root">
    
    <Navbar v-if="!$route.meta.hideNavbar" />
    
    <main>
      <router-view />
    </main>

  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
</script>