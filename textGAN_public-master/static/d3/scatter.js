function scatterplot(d, curr) {

	// Fetching desired data into an Array for further Usage
	var xdata = [];
	var linedata = [];
	var summer = 0.0;
	//var data1 = {};
	for (var j = 0; j < d.length; j++) {
		var num = d[j][curr];
		var res = num.split(" ");
		if(j == 1)
			console.log(res);
		if(res[0] != "0.0" && res[1] != "0.0")
		{
			linedata.push(parseFloat(res[0]));
			xdata.push(parseFloat(res[3]));	
		}
		
	}
	var data2 = {};
	data2["key"] = linedata;
	data2["value"] = xdata;

	//console.log(linedata);
	//console.log("xdata");
	//console.log(xdata);


	// Main svg window Sizes
	var width = 1000;
	var height = 530;


	// Color Function to utilize later
	var color = d3.scaleLinear()
		.domain([
			d3.min(data2.value, function(data) {return data; }),
			d3.max(data2.value, function(data) {return data; }) ])
		.range(["#c12a39", "#c12a39"]);



	// Main ssvg element Starts here
	var canvass = d3.select("#myChart")
		.append("svg")
		.attr("class", "mainchart")
		.attr("width", width)
		.attr("height", height);


	// Padding for chart Area
	var padding = {top:20, right:30, bottom:60, left:50};

	var charArea = {
		"width":width-padding.left-padding.right,
		"height":height-padding.top-padding.bottom
	};


	//console.log("MINIMUMS");
	//console.log(d3.min(linedata, function(d) {return d; }));
	//console.log(d3.min(xdata, function(d) {return d; }));

	// Defining XScales and yScales based on chartArea and domain
	var yScale = d3.scaleLinear()
		.domain([
			d3.min(linedata, function(d) {return d; }),
			d3.max(linedata, function(d) {return d; })
			])
		.range([charArea.height, 0]).nice();

	var xScale = d3.scaleLinear()
		.domain([
			d3.min(xdata, function(d) {return d; }),
			d3.max(xdata, function(d) {return d; })
			])
		.range([0, charArea.width]).nice();


	//console.log("XVALUES");
	//console.log(yScale(d3.min(linedata, function(d) {return d; })));
	//console.log(xScale(d3.min(xdata, function(d) {return d; })));

	// Defining Xaxis and yAxis ranges to display as svg elements
	var xAxis = canvass.append("g")
				.classed("xAxis", true)
				.attr('transform', 'translate('+padding.left+','+(charArea.height+padding.top)+')' )
				.call(d3.axisBottom(xScale).ticks(10))
				.selectAll("text")
		        .style("text-anchor", "end")
		        .attr("dx", "-.8em")
		        .attr("dy", ".15em")
		        .attr("transform", function (d) {
		        	return "rotate(-30)";
		        });

	var yAxisfn = d3.axisLeft(yScale).ticks(10);
	var yAxis = canvass.append("g")
				.classed("yAxis", true)
				.attr('transform', 'translate('+padding.left+','+padding.top+')'
				);
	
	yAxisfn(yAxis);


	// Transoforming x and y points of chartArea
	var rectGrp = canvass.append("g")
					.attr('transform', 'translate('+padding.left+','+padding.top+')'
					);



	// text label for the x axis and y axis
    canvass.append("text")
  	  .attr('transform', 'translate('+(charArea.width/2)+','+(charArea.height+padding.top+padding.bottom-10)+')' )          
      .style("text-anchor", "middle")
      .text(curr + ' Principal Component 1');

    canvass.append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text(curr + ' Principal Component 2');      



// create a subselection for our "dots"
    // and on enter append a bunch of circles
    rectGrp.selectAll(".dot")
      .data(linedata)
      .enter()
      .append("circle")
      .attr("r", function(d, i){
      		return 4;
      })
      .attr("cx", function(d, i) { return xScale(xdata[i]); })
      .attr("cy", function(d) { return yScale(d); })
      .attr("fill", function(d, i){
      		return "blue"
      });

};