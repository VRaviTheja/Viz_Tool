// set the dimensions and margins of the graph
var margin = {top: 30, right: 30, bottom: 70, left: 60},
	width = 1100 - margin.left - margin.right,
	height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#screeplot")
  .append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
  .append("g")
	.attr("transform",
		  "translate(" + margin.left + "," + margin.top + ")");

// Initialize the X axis
var x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
var xAxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")

// Initialize the Y axis
var y = d3.scaleLinear()
  .range([ height, 0]);
var yAxis = svg.append("g")
  .attr("class", "myYaxis")

//Line Graph		
var xline = d3.scalePoint().range([0, width]).padding(0.2);
var yline = d3.scaleLinear().range([height, 0]);
	
function plotScree(check){
	if (check == "Origianl Data")
	{
		update('org','orgc');
	}
	if (check == "Randomly Sampled Data")
	{
		update('rand','randc');
	}
	if (check == "Stratified Sampled Data")
	{
		update('strat','stratc');
	}

}	  
// A function that create / update the plot for a given variable:
function update(selectedVar,lineVar) {

  
  svg.selectAll("path").remove();
  
  // Parse the Data
  d3.csv("/static/interim.csv", function(error,data) {

	// define the 1st line
	var valueline = d3.line()
		.x(function(d) { return xline(d.Principal_Components); })
		.y(function(d) { return yline(d[lineVar]); });

	// X axis
	x.domain(data.map(function(d) { return d.Principal_Components; }))
	xAxis.transition().duration(1000).call(d3.axisBottom(x))

	// Add Y axis
	y.domain([0, 100 ]);
	yAxis.transition().duration(1000).call(d3.axisLeft(y));
	
	// Line X and Y axis 
	xline.domain(data.map(function(d) { return d.Principal_Components; }));
	yline.domain([0, d3.max(data, function(d) {return d[lineVar]; })]).nice();
	

	// variable u: map data to existing bars
	var u = svg.selectAll("rect")
	  .data(data)

	// update bars
	u
	  .enter()
	  .append("rect")
	  .merge(u)
	  .transition()
	  .duration(50)

		.attr("x", function(d) { return x(d.Principal_Components); })
		.attr("y", function(d) { return y(d[selectedVar]); })
		.attr("width", x.bandwidth())
		.attr("height", function(d) { return height - y(d[selectedVar]); })
		.attr("fill", "#4682b4")
		svg.append("text")
			.attr("text-anchor", "end")
			.attr("class", "label_x")
			.attr("x", width - 450)
			.attr("y", height + 40)
			.text("Prinicipal Components");

		svg.append("text")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("dy", "-4em")
			.attr("x",0 - (height / 2) + 30)
			.text("Explained Variance %");
  
  // Add the valueline path.
  svg.append("path")
	  .data([data])
	  .transition()
	  .duration(50)
	  .attr("class", "line")
	  .style("stroke", "#4682b4")
	  .attr("d", valueline);
	  
  var checkPoints = svg.selectAll("circle.point1")
	  .data(data)
		
  checkPoints.enter().append("circle")
	.merge(checkPoints)
	  .attr("class", "point1")
	  .style("stroke", "#4682b4")
	  .style("stroke-width", 0.5)
		.style("fill", function(d, i){return d.marker == 4?"red":"steelblue";})
	  .attr("cx", function(d){ return xline(d.Principal_Components); })
	  .attr("cy", function(d){ return yline(d[lineVar]); })
	  .attr("r", function(d){ return 5; });

  });
}
// Initialize plot
update('strat','stratc')

