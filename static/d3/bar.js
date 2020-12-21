function build_barchart(d, curr, cat_keys) {

	// Fetching desired data into an Array for further Usage	
	var data = [];
	var xdata = [];
	var linedata = [];
	var summer = 0.0;
	//var data1 = {};
	for (var j = 0; j < d.length; j++) {
		var num = d[j][curr];
		data.push(num);
		xdata.push(j+1);

		summer = summer + parseFloat(num);
		linedata.push(summer);

		//data1[num] = data1[num] ? data1[num] + 1 : 1;
	}
	var data2 = {};
	data2["key"] = xdata;
	data2["value"] = data;

	console.log(data);
	console.log("xdata");
	console.log(linedata);
	/*
	var data2 = {};
	data2["key"] = Object.keys(data1);
	data2["value"] = Object.values(data1);

	var data = [];
	for (var j = 0; j < data2.key.length; j++) {
		var temp = {};
		temp.key = data2.key[j]
		temp.value = data2.value[j];
		data.push(temp);
	}
	*/


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


	// Defining XScales and yScales based on chartArea and domain
	var yScale = d3.scaleLinear()
		.domain([
			0, 100])
			//d3.max(data2.value, function(d) {return d; })*1.2 ])

		.range([charArea.height, 0]).nice();

	var xScale = d3.scaleBand()
		.domain(xdata)
		.range([0, charArea.width])
		.padding(0.2);


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
      .text(curr + " Principal Components");

    canvass.append("text")
      .attr("transform", "rotate(-90)")
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Variance Percentage");      


	// Creating rect svg element and adding hists
	rectGrp.selectAll("rect")
		.data(data2.value)
		.enter()
			.append("rect")
			.attr("width", xScale.bandwidth())
			.attr("height", function(d, i) {
				console.log(d);
				return charArea.height-yScale(d);
				})
			.attr("x", function(d, i) {
				return xScale(data2.key[i]); })
			.attr("y", function(d, i) {return yScale(d); })
			.attr("fill", function(d) { return color(d); })
			.style('transform-origin','bottom')
  			.on('mouseover',function(d, i) {
	               
	            d3.select(this)
	               .transition()     
	               .duration(200)
	               .style("opacity", .6)
	               .attr('width', xScale.bandwidth() + 20)
	               .attr("y", function(d, j) { return yScale(d) - 10; })
	               .attr("height", function(d, j) { return charArea.height - yScale(d) + 10; })
	               .attr('x', function(d, j) { return xScale(data2.key[i]) - 10; });
	               //.attr("fill", "#1e5262");

	            var valll = d;
	            var textColorr = color(valll);
	            rectGrp
	               .append("svg:text")
	               .attr("class", "val")
	               .attr("x", function() {
	                  return xScale(data2.key[i]) + (xScale.bandwidth())/2 ;
	               })
	               .attr("y", function() {
	               		return yScale(d) - 20;
	               })
	               .attr("text-anchor", "middle")  
				   .style("font-size", "18px")
				   .style('fill', textColorr)
	               .text(function() { 
		               	size = "" + d;
		               	return size;
	               });
  			})
  		    .on('mouseout', function(d, i) {
	          
	            d3.select(this)
	               .transition()     
	               .duration(200)
	               .style("opacity", 1)
	               .attr('x', function(d, j) {return xScale(data2.key[i]); })
	               .attr('width', xScale.bandwidth())
	               .attr("y", function(d, j) { return yScale(d); })
	               .attr("height", function(d, j) { return charArea.height - yScale(d); })
	               .attr("fill", color(d));
	            
	            d3.selectAll('.val')
	               .remove();
  		    });











// Defining XScales and yScales based on chartArea and domain
	var lyScale = d3.scaleLinear()
		.domain([
			0, 100])
			//d3.max(data2.value, function(d) {return d; })*1.2 ])

		.range([charArea.height, 0]);

	var lxScale = d3.scaleBand()
		.domain(xdata)
		.range([0, charArea.width])
		.padding(0.2);




  	// line chart
  	var line = d3.line()
      .x(function(d, i) { return lxScale(xdata[i]) + lxScale.bandwidth() / 2; })
      .y(function(d) { return lyScale(d); })
      .curve(d3.curveMonotoneX);

  	rectGrp.append("path")
	    .attr("class", "line") // Assign a class for styling
	    .attr("fill", "none")
	    .attr("stroke", "steelblue")
	    .attr("stroke-width", 4)
	    .attr("d", line(linedata)); // 11. Calls the line generator





	    var inflection = 0;
	    var inflection1 = 0;

// create a subselection for our "dots"
    // and on enter append a bunch of circles
    rectGrp.selectAll(".dot")
      .data(linedata)
      .enter()
      .append("circle")
      .attr("r", function(d, i){
      		if(inflection1 == 0)
      		{
      			if (d < 75)
      			{
      				return 4;	
      			}
      			else
      			{
      				inflection1 = 1.0;
      				return 8;
      			}
      			
      		}
      		else
      		{
      			return 4;	
      		}
      })
      .attr("cx", function(d, i) { return lxScale(xdata[i]) + lxScale.bandwidth() / 2; })
      .attr("cy", function(d) { return lyScale(d); })
      .attr("fill", function(d, i){
      		if(inflection == 0)
      		{
      			if (d < 75)
      			{
      				return "steelblue";	
      			}
      			else
      			{
      				inflection = 1.0;
      				return "red";
      			}
      			
      		}
      		else
      		{
      			return "steelblue";	
      		}
        //return d3.select(this.parentNode).datum().category;
      });

};