<template>
  <div ref="chartContainer" class="w-full h-auto"></div>
</template>

<script>
import * as d3 from 'd3';
import { onMounted, ref, watch, onBeforeUnmount, nextTick } from 'vue';

export default {
  name: 'StackedAreaChart',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const chartContainer = ref(null);
    let svg = null;

    const renderStackedAreaChart = () => {
      if (!chartContainer.value) return;

      const width = chartContainer.value.clientWidth;
      const height = 500;

      // Remove previous SVG if exists
      if (svg) svg.remove();

      svg = d3.select(chartContainer.value)
          .append("svg")
          .attr("width", width)
          .attr("height", height);

      // Organize data for the stacked area chart
      const keys = ["total_micrometers", "total_provider_fee"];
      const stack = d3.stack().keys(keys);

      const stackedData = stack(props.data);

      // Scales
      const x = d3.scaleLinear()
          .domain(d3.extent(props.data, d => +d.year))
          .range([40, width - 20]);

      const y = d3.scaleLinear()
          .domain([0, d3.max(stackedData, layer => d3.max(layer, d => d[1]))])
          .range([height - 40, 20]);

      const color = d3.scaleOrdinal()
          .domain(keys)
          .range(["#66c2a5", "#fc8d62"]);

      // Axes
      svg.append("g")
          .attr("transform", `translate(0,${height - 40})`)
          .call(d3.axisBottom(x).tickFormat(d3.format("d")));

      svg.append("g")
          .attr("transform", `translate(40,0)`)
          .call(d3.axisLeft(y));

      // Area generator
      const area = d3.area()
          .x(d => x(d.data.year))
          .y0(d => y(d[0]))
          .y1(d => y(d[1]));

      // Draw stacked areas
      svg.selectAll(".area")
          .data(stackedData)
          .enter()
          .append("path")
          .attr("class", "area")
          .attr("d", area)
          .attr("fill", d => color(d.key))
          .attr("stroke", "#fff")
          .attr("stroke-width", 1);

      // Legend
      svg.selectAll(".legend")
          .data(keys)
          .enter()
          .append("rect")
          .attr("x", width - 120)
          .attr("y", (d, i) => 20 + i * 20)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", d => color(d));

      svg.selectAll(".legend-text")
          .data(keys)
          .enter()
          .append("text")
          .attr("x", width - 100)
          .attr("y", (d, i) => 32 + i * 20)
          .attr("font-size", "12px")
          .attr("fill", "#000")
          .text(d => d === "total_micrometers" ? "Micromedidores" : "Cuotas de Prestadores");
    };

    watch(() => props.data, renderStackedAreaChart, { immediate: true });

    onMounted(async () => {
      await nextTick();
      renderStackedAreaChart();
      window.addEventListener("resize", renderStackedAreaChart);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", renderStackedAreaChart);
    });

    return {
      chartContainer,
    };
  },
};
</script>

<style scoped>
.chart-container {
  margin: 20px;
}
</style>
