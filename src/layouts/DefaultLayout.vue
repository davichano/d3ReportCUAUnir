<!-- src/layouts/DefaultLayout.vue -->
<template>
  <div class="flex flex-col min-h-screen poppins-medium">
    <!-- Header -->
    <header class="bg-blue-100">
      <nav class="container mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <!-- Logo -->
          <img :src="logo" alt="Logo" class="h-16 w-16"/>

          <!-- Text next to logo -->
          <div class="text-blue-950">
            <h1 class="text-xl font-bold">Report D3</h1>
            <p class="text-sm">Aceeso al Agua en Perú</p>
          </div>
        </div>

        <!-- Menu for larger screens -->
        <ul class="hidden md:flex space-x-4">
          <li>
            <router-link to="/" class="hover:text-gray-400">Inicio</router-link>
          </li>
        </ul>

        <!-- Hamburger Menu for mobile -->
        <button @click="toggleMenu" class="md:hidden focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="absolute top-16 right-0 bg-gray-800 w-full p-6 md:hidden">
          <ul class="flex flex-col space-y-4">
            <li>
              <router-link @click="toggleMenu" to="/" class="hover:text-gray-400">Inicio</router-link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
    <!-- Main content -->
    <router-view/>
    <!-- Footer -->
    <!-- Footer -->
    <footer class="bg-blue-100 text-blue-900 py-10 mt-auto">
      <div class="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- About Section -->
        <div class="space-y-4">
          <div class="flex items-start space-x-5">
            <!-- Logo -->
            <img :src="logo" alt="Logo" class="h-16 w-16"/>

            <!-- Text next to logo -->
            <div>
              <h3 class="text-lg font-bold">D3 Report by David Paredes</h3>
              <p class="text-sm text-justify font-light text-black">
                Plataforma interactiva de monitoreo para visualizar el acceso a servicios de agua potable en el Perú.
                Utilizando datos detallados de cada Área Técnica Municipal (ATM), esta herramienta busca
                apoyar iniciativas que mejoren las condiciones de vida en comunidades rurales.
              </p>
            </div>
          </div>

        </div>
        <div class="space-y-4">
          <div class="flex items-start space-x-5">
            <div>
              <h3 class="text-lg font-bold">CUA UNIR</h3>
              <p class="text-sm text-justify font-light text-black">
                Este proyecto es parte de la actividad en el curso de Ingeniería de Software en la UNIR, donde el
                objetivo es desarrollar una visualización interactiva usando D3.js.
              </p>
            </div>
          </div>

        </div>
        <div class="space-y-4">
          <div class="flex items-start space-x-5">
            <div>
              <h3 class="text-lg font-bold">FUENTE DE DATOS</h3>
              <p class="text-sm text-justify font-light text-black">
                Los datos utilizados en esta visualización provienen de la base de datos de la Superintendencia Nacional
                de Servicios de Saneamiento (SUNASS) y han sido obtenidos desde el portal de Datos Libres del
                Gobierno del Perú.
              </p>
              <a target="_blank" href="https://www.datosabiertos.gob.pe/dataset/sistema-de-registro-de-informaci%C3%B3n-de-%C3%A1rea-t%C3%A9cnica-municipal-sobre-los-prestadores-del"> Ver datos</a>
            </div>
          </div>

        </div>
      </div>

      <div class="container mx-auto px-6 mt-8 text-center border-t border-blue-800 pt-4">
        <p>&copy; {{ new Date().getFullYear() }} DAVID PAREDES. Todos los derechos reservados.</p>

      </div>
    </footer>
  </div>
</template>

<script>
import logo from '@/assets/images/logo.png'

export default {
  data() {
    return {
      mobileMenuOpen: false,
      logo
    }
  },
  methods: {
    toggleMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen
    }
  }
}
</script>

<style scoped>
/* Scoped styles */
</style>
