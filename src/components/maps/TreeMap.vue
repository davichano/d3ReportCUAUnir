<template>
  <div ref="treeContainer" class="w-full h-auto bg-white"></div>
</template>

<script>
import * as d3 from 'd3';
import { onMounted, ref, watch, onBeforeUnmount } from 'vue';

export default {
  name: 'TreeMap',
  props: {
    atmData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const treeContainer = ref(null);

    const renderTree = () => {
      const width = treeContainer.value.clientWidth;
      const dx = 10;
      const dy = width / 4;

      const root = d3.hierarchy(props.atmData)
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value);

      const treeLayout = d3.tree().nodeSize([dx, dy]);
      treeLayout(root);

      let x0 = Infinity;
      let x1 = -Infinity;
      root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
      });
      const height = x1 - x0 + dx * 2;

      d3.select(treeContainer.value).selectAll('*').remove();

      const svg = d3.create('svg')
          .attr('viewBox', [-dy / 3, x0 - dx, width, height])
          .attr('width', width)
          .attr('height', height)
          .attr('font-family', 'sans-serif')
          .attr('font-size', 10);

      svg.append('g')
          .attr('fill', 'none')
          .attr('stroke', '#555')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 1.5)
          .selectAll('path')
          .data(root.links())
          .join('path')
          .attr('d', d3.linkHorizontal()
              .x(d => d.y)
              .y(d => d.x));

      const node = svg.append('g')
          .selectAll('g')
          .data(root.descendants())
          .join('g')
          .attr('transform', d => `translate(${d.y},${d.x})`);

      node.append('circle')
          .attr('fill', d => d.children ? '#555' : '#999')
          .attr('r', 4);

      node.append('text')
          .attr('dy', '0.32em')
          .attr('x', d => d.children ? -6 : 6)
          .attr('text-anchor', d => d.children ? 'end' : 'start')
          .text(d => `${d.data.name}${d.data.value ? ` (${d.data.value} ATMs)` : ''}`)
          .clone(true).lower()
          .attr('stroke', 'white')
          .attr('stroke-width', 3);

      d3.select(treeContainer.value).node().append(svg.node());
    };

    watch(
        () => props.atmData,
        renderTree
    );

    onMounted(() => {
      renderTree();
      window.addEventListener('resize', renderTree);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', renderTree);
    });

    return {
      treeContainer,
    };
  },
};
</script>
