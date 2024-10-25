<template>
  <div ref="yearContainer" class="w-full h-auto"></div>
</template>

<script>
import * as d3 from 'd3';
import { onMounted, ref, watch, onBeforeUnmount, nextTick } from 'vue';

export default {
  name: 'YearEvolutionMap',
  props: {
    yearData: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const yearContainer = ref(null);
    let svg = null;

    const renderYearEvolution = () => {
      if (!yearContainer.value) return;

      const width = yearContainer.value.clientWidth;
      const height = yearContainer.value.clientHeight || 500;

      if (svg) svg.remove();

      svg = d3.select(yearContainer.value)
          .append("svg")
          .attr("width", width)
          .attr("height", height);

      // Convertir y organizar datos
      const nestedData = props.yearData.map(d => ({
        year: +d.date,
        total_cp: d.total_cp,
        cp_with_water: d.cp_with_water,
      }));

      // Escalas
      const x = d3.scaleLinear()
          .domain(d3.extent(nestedData, d => d.year))
          .range([40, width - 20]);

      const y = d3.scaleLinear()
          .domain([0, d3.max(nestedData, d => Math.max(d.total_cp, d.cp_with_water))])
          .range([height - 40, 20]);

      // Ejes
      svg.append("g")
          .attr("transform", `translate(0,${height - 40})`)
          .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      svg.append("g")
          .attr("transform", `translate(40,0)`)
          .call(d3.axisLeft(y));

      // Línea para total_cp
      svg.append("path")
          .datum(nestedData)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-width", 2)
          .attr("d", d3.line()
              .x(d => x(d.year))
              .y(d => y(d.total_cp))
          );

      // Línea para cp_with_water
      svg.append("path")
          .datum(nestedData)
          .attr("fill", "none")
          .attr("stroke", "green")
          .attr("stroke-width", 2)
          .attr("d", d3.line()
              .x(d => x(d.year))
              .y(d => y(d.cp_with_water))
          );

      // Puntos y etiquetas para total_cp
      svg.selectAll(".total_cp-circle")
          .data(nestedData)
          .enter()
          .append("circle")
          .attr("class", "total_cp-circle")
          .attr("cx", d => x(d.year))
          .attr("cy", d => y(d.total_cp))
          .attr("r", 4)
          .attr("fill", "steelblue");

      svg.selectAll(".total_cp-text")
          .data(nestedData)
          .enter()
          .append("text")
          .attr("class", "total_cp-text")
          .attr("x", d => x(d.year))
          .attr("y", d => y(d.total_cp) - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("fill", "steelblue")
          .text(d => d.total_cp);

      // Puntos y etiquetas para cp_with_water
      svg.selectAll(".cp_with_water-circle")
          .data(nestedData)
          .enter()
          .append("circle")
          .attr("class", "cp_with_water-circle")
          .attr("cx", d => x(d.year))
          .attr("cy", d => y(d.cp_with_water))
          .attr("r", 4)
          .attr("fill", "green");

      svg.selectAll(".cp_with_water-text")
          .data(nestedData)
          .enter()
          .append("text")
          .attr("class", "cp_with_water-text")
          .attr("x", d => x(d.year))
          .attr("y", d => y(d.cp_with_water) - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("fill", "green")
          .text(d => d.cp_with_water);

      // Etiquetas de leyenda
      svg.append("text")
          .attr("x", width - 100)
          .attr("y", 30)
          .attr("fill", "steelblue")
          .attr("font-size", "12px")
          .text("Total CP");

      svg.append("text")
          .attr("x", width - 100)
          .attr("y", 50)
          .attr("fill", "green")
          .attr("font-size", "12px")
          .text("CP con Agua");
    };

    watch(() => props.yearData, renderYearEvolution, { immediate: true });

    onMounted(async () => {
      await nextTick();
      renderYearEvolution();
      window.addEventListener("resize", renderYearEvolution);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", renderYearEvolution);
    });

    return {
      yearContainer,
    };
  },
};
</script>
