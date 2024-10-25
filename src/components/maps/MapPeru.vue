
<template>
  <div ref="mapContainer" class="w-full h-[1100px] md:h-[1100px]"></div>
</template>
<script>
import * as d3 from 'd3'
import { geoMercator, geoPath } from 'd3-geo'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { getCoverageColor, normalizeString } from '@/utils/utils.js'
import {useRouter} from "vue-router";
export default {
  name: 'MapPeru',
  props: {
    regionsData: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const mapContainer = ref(null)
    let svg = null
    const router = useRouter()

    const renderMap = () => {
      const width = mapContainer.value.clientWidth
      const height = Math.max(mapContainer.value.clientHeight, 750)

      if (svg) svg.remove()

      svg = d3
          .select(mapContainer.value)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .attr('viewBox', `0 0 ${width} ${height}`)
          .attr('preserveAspectRatio', 'xMidYMid meet')



      d3.json('/geojson/peru_departamental_simple.geojson').then((geoData) => {
        const peruRegions = geoData.features

        const projection = geoMercator().fitSize([width, height], {
          type: 'FeatureCollection',
          features: peruRegions
        })

        const path = geoPath().projection(projection)

        svg
            .selectAll('path')
            .data(peruRegions)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('fill', (d) => {
              const regionData = props.regionsData.find(p => normalizeString(p.name) === normalizeString(d.properties.NOMBDEP))
              return regionData ? getCoverageColor(regionData.percentage_with_water) : 'rgba(255, 255, 255, 1)'
            })
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .style('cursor', 'pointer')
            .on('click', function(event, d) {
              const provinceName = d.properties.NOMBDEP
              router.push({ name: 'provinceReport', params: { provinceName } })
            })
            .on('mouseover', function() {
              d3.select(this)
                  .attr('stroke-width', 3)
                  .attr('stroke', '#1e3a8a')
            })
            .on('mouseout', function() {
              d3.select(this)
                  .attr('stroke-width', 1)
                  .attr('stroke', 'black')
            })

        svg
            .selectAll('text')
            .data(peruRegions)
            .enter()
            .append('text')
            .attr('x', (d) => path.centroid(d)[0])
            .attr('y', (d) => path.centroid(d)[1])
            .attr('text-anchor', 'middle')
            .attr('fill', '#000')
            .attr('font-size', '10px')
            .each(function(d) {
              const regionData = props.regionsData.find(p => normalizeString(p.name) === normalizeString(d.properties.NOMBDEP))
              const regionName = d.properties.NOMBDEP
              const waterPercentage = regionData ? `(${regionData.percentage_with_water.toFixed(2)}%)` : ''

              d3.select(this)
                  .append('tspan')
                  .attr('x', path.centroid(d)[0])
                  .attr('dy', '0')
                  .attr('font-weight', 'bold')
                  .text(regionName)

              d3.select(this)
                  .append('tspan')
                  .attr('x', path.centroid(d)[0])
                  .attr('dy', '1.2em')
                  .text(waterPercentage)
            })
      })
    }

    watch(() => props.regionsData, renderMap)

    const handleResize = () => {
      renderMap()
    }

    onMounted(() => {
      renderMap()
      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
    })

    return {
      mapContainer
    }
  }
}

</script>
<style scoped>

</style>