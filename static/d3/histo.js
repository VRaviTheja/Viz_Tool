function build_histogramvarGraph(d, curr, numeric_keys) {

	// Fetching desired data into an Array for further Usage
	var data2 = [];
	for (var j = 1; j < d.length; j++) {
		var num = d[j][curr];
		data2.push(num);
	}


	// Main svg window Sizes
	var width = 1000;
	var height = 530;


	// Color Function to utilize later
	var color = d3.scaleLinear()
		.domain([
			d3.min(data2, function(data) {return data; }),
			d3.max(data2, function(data) {return data; })])
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
		.range([charArea.height, 0]).nice();

	var xScale = d3.scaleLinear()
		.domain([
			0,
			d3.max(data2, function(d) {return d; } )])
		.range([0, charArea.width]);


	// Defining Xaxis and yAxis ranges to display as svg elements
	var xAxis = canvass.append("g")
		.classed("xAxis", true)
		.attr('transform', 'translate('+padding.left+','+(charArea.height+padding.top)+')'
		)
		.call(d3.axisBottom(xScale))
		.selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function (d) {
        	return "rotate(-30)";
        });

	var yAxis = canvass.append("g")
				.classed("yAxis", true)
				.attr('transform', 'translate('+padding.left+','+padding.top+')'
				);


	// Transoforming x and y points of chartArea
	var rectGrp = canvass.append("g")
					.attr('transform', 'translate('+padding.left+','+padding.top+')'
					);

    
	// text label for the x axis and y axis
	  canvass.append("text")
	  	  .attr('transform', 'translate('+(charArea.width/2)+','+(charArea.height+padding.top+padding.bottom-10)+')' )
	      .style("text-anchor", "middle")
	      .text(curr);

	  canvass.append("text")
	      .attr("transform", "rotate(-90)")
	      .attr("dy", "1em")
	      .style("text-anchor", "end")
	      .text("Frequency");  



	// This function is called as slider moves to calculate bins and plot graph accordingly
    function updatebins(Givenbins) {
    	 
	    var histogram = d3.histogram()
	        .value(function(d) { return d; })
	        .domain(xScale.domain())
	        .thresholds(xScale.ticks(Givenbins));

	    var bins = histogram(data2);

	    // Defining yScale based bins counted
		yScale.domain([
					0,
					d3.max(bins, function(d) {return d.length; })*1.2
					]);
		var yAxisfn = d3.axisLeft(yScale);		
		yAxisfn(yAxis);


		// Creating rect svg element and adding hists
		var newEle = rectGrp.selectAll("rect")
							.data(bins);

		newEle
			.enter()
			  .append("rect")
			  .attr("class", "maingraph")
	          .attr("x", 1)
	          .attr("transform", function(d) { console.log(d.x0); return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
	          .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) ; })
	          .attr("height", function(d) { return charArea.height - yScale(d.length); })
	          .style('transform-origin','bottom')
			  .attr("fill", function(d, i) { return color(d.length); })

			  
			  .on('mouseover',function(d, i) {	               
		            d3.select(this)
		              .transition()     
		              .duration(200)
		              .style("opacity", .7)
		              .attr("y", function(d, i) { return -10; })
			          .attr("width", function() { return xScale(d.x1) - xScale(d.x0)  ; })
			          .attr("height", function() { return charArea.height - yScale(d.length) + 10; })
		              
		            var textColorr = color(d.length);
		            rectGrp
		               .append("svg:text")
		               .attr("class", "val")
		               .attr("x", function() {
		                  return xScale((d.x0 + d.x1) / 2);
		               })
		               .attr("y", function() {
		               		return  yScale(d.length) - 20;
		               })
		               .attr("text-anchor", "middle")  
					   .style("font-size", "18px")
					   .style('fill', textColorr)
		               .text(function() { 
		               	size = d.length;
		               	return size;});
		      })
			  .on('mouseout', function(d, i) {      
		            d3.select(this)
		               .transition()     
		               .duration(200)
		               .style("opacity", 1)
		               .attr("x", 1)
			           .attr("y", function(d, i) { return 0; })
			           .attr("transform", function(d) { console.log(d.x0); return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
			           .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) ; })
			           .attr("height", function(d) { return charArea.height - yScale(d.length); })
			           .style('transform-origin','bottom')
					   .attr("fill", function(d, i) { return color(d.length); });
		            
		            d3.selectAll('.val')
		               .remove();
			    });	
	};
	

	var reqBins = 10;
	d3.select("#myChart").on("mousedown", function() {
  		
  		// Collecting the html element to work on
	  	var div = d3.select(this)
		    .classed("active", true);

		// Get current x position on button.
		var pos = d3.mouse(div.node())[0];
		var win = d3.select(window)
			.on("mousemove", fnFormouseMove)
			.on("mouseup", function(){
				div.classed("active", false);
		    	win.on("mousemove", null).on("mouseup", null);
		 	});

		// On mouse move increase or decrease the number of bins.    	
		function fnFormouseMove() {
		  	if(d3.mouse(div.node())[0] + 20 < pos && reqBins < 100){
		  		reqBins += 2;
		  		d3.selectAll(".maingraph")
		  				.remove();
		  		d3.selectAll('.val')
		               .remove();
		  		updatebins(reqBins);
		  		pos = d3.mouse(div.node())[0];
		  	}
		    else if(d3.mouse(div.node())[0] - 20 > pos && reqBins > 1){
		  		reqBins -= 2;
		  		d3.selectAll(".maingraph")
		  				.remove();
		  		d3.selectAll('.val')
		               .remove();
		  		updatebins(reqBins);
		  		pos = d3.mouse(div.node())[0];
		  	}
		}
	}); 

	updatebins(10);

};