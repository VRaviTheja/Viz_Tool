const width = window.innerWidth
const height = window.innerHeight
const svg = d3.select('svg')
  .attr('width', width)
  .attr('height', height)
  
const simulation = d3.forceSimulation()
  .force('charge', d3.forceManyBody().strength(-20)) 
  .force('center', d3.forceCenter(width / 2, height / 2))
  
//function getNodeColor(node) {
//  return node.color === "positive" ? 'red' : 'gray'
//}

const nodeElements = svg.append('g')
  .selectAll('circle')
  .data(nodes)
  .enter().append('circle')
    .attr('r', 10)
    .attr('fill', getNodeColor)
const textElements = svg.append('g')
  .selectAll('text')
  .data(nodes)
  .enter().append('text')
    .text(node => node.label)
    .attr('font-size', 15)
    .attr('dx', 15)
    .attr('dy', 4)