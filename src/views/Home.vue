<template>
  <section class="flex flex-col w-full justify-center mx-auto py-[100px] bg-blue-100">
    <!-- Contenedor del título y subtítulo -->
    <div class="w-full text-center mb-16">
      <h2 class="text-3xl font-bold mb-1 uppercase">Porcentaje de <span
          class="text-blue-900">acceso a servicios de agua</span> por región</h2>
      <h3 class="text-2xl font-medium">Número de Centros Poblados con sistemas de agua</h3>
    </div>

    <!-- Contenedor del mapa y la tabla -->
    <div class="container mx-auto flex flex-col lg:flex-row justify-center items-center lg:items-start w-full gap-8">
      <!-- Mapa -->
      <div class="w-full lg:w-1/2">
        <div v-if="resumeRegionWater&&resumeRegionWater.length > 0">
          <MapPeru :regions-data="resumeRegionWater"/>
        </div>
        <div v-else>
          <p>Procesando información del mapa...</p>
        </div>
      </div>

      <!-- Tabla -->
      <div class="w-full lg:w-1/2">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-4 py-3 text-center">Region</th>
              <th scope="col" class="px-4 py-3 text-center">CP Total</th>
              <th scope="col" class="px-4 py-3 text-center">Con Acceso a Agua</th>
              <th scope="col" class="px-4 py-3 text-center">Sin Acceso a Agua</th>
              <th scope="col" class="px-4 py-3 text-center">Porcentaje con acceso</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="region in resumeRegionWater" :key="region.name"
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:cursor-pointer">
              <td class="px-4 py-3 text-center">{{ region.name }}</td>
              <td class="px-4 py-3 text-center">{{ formatNumber(region.total_cp) }}</td>
              <td class="px-4 py-3 text-center">{{ formatNumber(region.cp_with_water) }}</td>
              <td class="px-4 py-3 text-center">{{ formatNumber(region.cp_without_water) }}</td>
              <td class="px-4 py-3 text-center">{{ (region.percentage_with_water || 0).toFixed(2) }}%</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
  <section class="flex flex-col w-full justify-center mx-auto py-[100px] bg-blue-100">
    <!-- Contenedor del título y subtítulo -->


    <!-- Contenedor del mapa y la tabla -->
    <div class="container mx-auto flex flex-col lg:flex-row justify-center items-center lg:items-start w-full gap-8">
      <!-- Mapa -->
      <div class="w-full lg:w-1/2 bg-white py-10 rounded-xl">
        <div class="w-full text-center mb-16">
          <h2 class="text-3xl font-bold mb-1 uppercase">Cantidad de <span
              class="text-blue-900">ATM</span> registrados</h2>
          <h3 class="text-2xl font-medium">ATM: Áreas Técnicas Municipales</h3>
        </div>
        <div v-if="resumeATM">
          <TreeMap :atm-data="resumeATM"/>
        </div>
        <div v-else>
          <p>Procesando información del mapa...</p>
        </div>
      </div>

      <!-- Tabla -->
      <div class="w-full lg:w-1/2">
        <div class="relative overflow-x-auto bg-white p-10 rounded-xl  mb-10">
          <div class="w-full text-center mb-16">
            <h2 class="text-3xl font-bold mb-1 uppercase">Evolución de <span
                class="text-blue-900">CP con acceso a agua</span></h2>
            <h3 class="text-2xl font-medium">por año</h3>
          </div>
          <div v-if="resumeYear">
            <YearEvolutionMap :year-data="resumeYear"/>
          </div>
          <div v-else>
            <p>Procesando información del mapa...</p>
          </div>
        </div>
        <div class="relative overflow-x-auto bg-white p-10 rounded-xl">
          <div class="w-full text-center mb-16">
            <h2 class="text-3xl font-bold mb-1 uppercase">Correlación de <span
                class="text-blue-900">POI anual</span></h2>
            <h3 class="text-2xl font-medium">y la cantidad de SA</h3>
          </div>
          <div v-if="poiData">
            <StackedAreaChart :data="poiData"/>
          </div>
          <div v-else>
            <p>Procesando información del mapa...</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import MapPeru from '@/components/maps/MapPeru.vue'
import TreeMap from '@/components/maps/TreeMap.vue'
import YearEvolutionMap from '@/components/maps/YearEvolutionMap.vue'
import StackedAreaChart from '@/components/maps/StackedAreaChart.vue'
import {onMounted, ref} from 'vue'
import {formatNumber} from '@/utils/utils.js'
import {
  getHierarchicalDataForTreeMap,
  getPoiQualityCorrelation,
  getServiceComparisonByDepartment,
  loadData,
  renderServiceEvolution
} from '@/services/loadData'

export default {
  name: 'Home',
  components: {
    MapPeru,
    TreeMap,
    YearEvolutionMap,
    StackedAreaChart
  },
  setup() {
    const resumeRegionWater = ref(null)
    const resumeATM = ref(null)
    const resumeYear = ref(null)
    const poiData = ref(null)

    async function fetchHomeData() {
      const data = await loadData()

      resumeRegionWater.value = getServiceComparisonByDepartment(data)
      resumeATM.value = getHierarchicalDataForTreeMap(data)
      resumeYear.value = renderServiceEvolution(data)
      poiData.value = getPoiQualityCorrelation(data)
    }

    onMounted(() => {
      fetchHomeData()
    })


    return {
      formatNumber,
      resumeRegionWater,
      resumeATM,
      resumeYear,
      poiData
    }
  }
}
</script>