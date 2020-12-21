var size = 300,
	padding = 20;
	
var svg = d3.select("#screeplot").append("svg")
  .attr("width", size * 3 + padding)
  .attr("height", size * 3 + padding)
  .append("g")
  .attr("transform", "translate(" + padding + "," + padding / 2 + ")");
	  
function sctplt(checker){
	d3.selectAll("svg").remove();
	
	var att = "";
	if (checker == "Scatter Plot Matrix Original")
	{	
		att = "o";
	}
	if (checker == "Scatter Plot Matrix Random")
	{	
		att = "r";
	}
	if(checker == "Scatter Plot Matrix Stratified")
	{	
		att = "s";
	}
		

	var x = d3.scaleLinear()
		.range([padding / 2, size - padding / 2]);

	var y = d3.scaleLinear()
		.range([size - padding / 2, padding / 2]);

	var xAxis = d3.axisBottom()
		.scale(x)
		.ticks(7);

	var yAxis = d3.axisLeft()
		.scale(y)
		.ticks(7);

	var color = d3.scaleOrdinal(d3.schemeCategory10);

	d3.csv("/static/scatter"+ att +".csv", function(error, data) {
	  if (error) throw error;

	  var domainByTrait = {},
		  variables = d3.keys(data[0]).filter(function(d) { return d; }),
		  n = variables.length;

	  variables.forEach(function(trait) {
		domainByTrait[trait] = d3.extent([-2,2]);
	  });

	  xAxis.tickSize(size * n);
	  yAxis.tickSize(-size * n);

	var svg = d3.select("#screeplot").append("svg")
	  .attr("width", size * 3 + padding)
	  .attr("height", size * 3 + padding)
	  .append("g")
	  .attr("transform", "translate(" + padding + "," + padding / 2 + ")");



	  svg.selectAll(".x.axis")
		  .data(variables)
		.enter().append("g")
		  .attr("class", "x axis")
		  .attr("transform", function(d, i) { return "translate(" + (n - i - 1) * size + ",0)"; })
		  .each(function(d) {
			  x.domain(domainByTrait[d]); d3.select(this).call(xAxis); 
			});

	  svg.selectAll(".y.axis")
		  .data(variables)
		.enter().append("g")
		  .attr("class", "y axis")
		  .attr("transform", function(d, i) { return "translate(0," + i * size + ")"; })
		  .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

	  var cell = svg.selectAll(".cell")
		  .data(crossProduct(variables, variables))
		.enter().append("g")
		  .attr("class", "cell")
		  .attr("transform", function(d) { return "translate(" + (n - d.i - 1) * size + "," + d.j * size + ")"; })
		  .each(plot);

	  // Titles for the diagonal.
	  cell.filter(function(d) { return d.i === d.j; }).append("text")
		  .attr("x", padding)
		  .attr("y", padding)
		  .attr("dy", ".71em")
		  .text(function(d) { return d.x; });


	  function plot(p) {
		var cell = d3.select(this);

		x.domain(domainByTrait[p.x]);
		y.domain(domainByTrait[p.y]);

		cell.append("rect")
			.attr("class", "frame")
			.attr("x", padding / 2)
			.attr("y", padding / 2)
			.attr("width", size - padding)
			.attr("height", size - padding);

		cell.selectAll("circle")
			.data(data)
		  .enter().append("circle")
			.attr("cx", function(d) { return x(d[p.x]); })
			.attr("cy", function(d) { return y(d[p.y]); })
			.attr("r", 4)
			.style("fill", function(d) { return color(d.species); });
	  }

	});

	function crossProduct(a, b) {
	  var c = [], n = a.length, m = b.length, i, j;
	  for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
	  return c;
	}
	
}
sctplt("Scatter Plot Matrix Stratified")