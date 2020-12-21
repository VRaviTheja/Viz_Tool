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

svg.append("text")
	.attr("text-anchor", "end")
	.attr("class", "label_x")
	.attr("x", width - 450)
	.attr("y", height + 40)
	.text("Principal Component 1");

svg.append("text")
	.attr("text-anchor", "end")
	.attr("transform", "rotate(-90)")
	.attr("dy", "-4em")
	.attr("x",0 - (height / 2) + 30)
	.text("Principal Component 2");

		  
function scatter(check)
{	  
	
    svg.selectAll("g").remove();

	if(check == "Original PCA Scatter Plot")
	{
		d3.csv("/static/plotpcaorg.csv", function(data) {
			// Add X axis
			var x = d3.scaleLinear()
			.domain([-2,2])
				.range([ 0, width ]);
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));
				
		  // Add Y axis
		  var y = d3.scaleLinear()
			.domain([-2,2])
			.range([ height, 0]);
		  svg.append("g")
			.call(d3.axisLeft(y));
			

		  // Add dots
		  svg.append('g')
			.selectAll("dot")
			.data(data)
			.enter()
			.append("circle")
			  .attr("cx", function (d) { return x(d.Principal_Component_1_Original); } )
			  .attr("cy", function (d) { return y(d.Principal_Component_2_Original); } )
			  .attr("r", 3)
			  .attr("fill", "#4682b4")
			  .attr("opacity",0.5)
		svg.append("text")
			.attr("text-anchor", "end")
			.attr("class", "label_x")
			.attr("x", width - 450)
			.attr("y", height + 40)
			.text("Principal Component 1");

		svg.append("text")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("dy", "-4em")
			.attr("x",0 - (height / 2) + 30)
			.text("Principal Component 2");

		});
	}
	if(check == "Random PCA Scatter Plot")
	{
		d3.csv("/static/plotpcarand.csv", function(data) {
			// Add X axis
			var x = d3.scaleLinear()
			.domain([-2,2])
				.range([ 0, width ]);
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));
				
		  // Add Y axis
		  var y = d3.scaleLinear()
			.domain([-2,2])
			.range([ height, 0]);
		  svg.append("g")
			.call(d3.axisLeft(y));
			

		  // Add dots
		  svg.append('g')
			.selectAll("dot")
			.data(data)
			.enter()
			.append("circle")
			  .attr("cx", function (d) { return x(d.Principal_Component_1_Random); } )
			  .attr("cy", function (d) { return y(d.Principal_Component_2_Random); } )
			  .attr("r", 3)
			  .attr("fill", "#4682b4")
			  .attr("opacity",0.5)
		svg.append("text")
			.attr("text-anchor", "end")
			.attr("class", "label_x")
			.attr("x", width - 450)
			.attr("y", height + 40)
			.text("Principal Component 1");

		svg.append("text")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("dy", "-4em")
			.attr("x",0 - (height / 2) + 30)
			.text("Principal Component 2");

		});
	}
	if(check == "Stratified PCA Scatter Plot")
	{
		d3.csv("/static/plotpcastrat.csv", function(data) {
			// Add X axis
			var x = d3.scaleLinear()
			.domain([-2,2])
				.range([ 0, width ]);
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));
				
		  // Add Y axis
		  var y = d3.scaleLinear()
			.domain([-2,2])
			.range([ height, 0]);
		  svg.append("g")
			.call(d3.axisLeft(y));
			

		  // Add dots
		  svg.append('g')
			.selectAll("dot")
			.data(data)
			.enter()
			.append("circle")
			  .attr("cx", function (d) { return x(d.Principal_Component_1_Stratified); } )
			  .attr("cy", function (d) { return y(d.Principal_Component_2_Stratified); } )
			  .attr("r", 3)
			  .attr("fill", "#4682b4")
			  .attr("opacity",0.5)
			  
		svg.append("text")
			.attr("text-anchor", "end")
			.attr("class", "label_x")
			.attr("x", width - 450)
			.attr("y", height + 40)
			.text("Principal Component 1");

		svg.append("text")
			.attr("text-anchor", "end")
			.attr("transform", "rotate(-90)")
			.attr("dy", "-4em")
			.attr("x",0 - (height / 2) + 30)
			.text("Principal Component 2");

		});
	}

}

scatter("Stratified PCA Scatter Plot")
