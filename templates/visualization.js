  
d3.select("#binsChange").on("mousedown", function() {
	var mydiv = d3.select(this).classed("active", true);

	//This will get us the current position in the x axis. So, that we can map it to the current number of bins.
	var x_pos = d3.mouse(mydiv.node())[0];
	
	//Standard D3 logic to check mouse movement and if the mouse moves up, do not inc/dec numBins. 
	var mywindow = d3.select(window)
		.on("mousemove", UpdateBins)
		.on("mouseup", function(){
			mydiv.classed("active", false);
			mywindow.on("mousemove", null).on("mouseup", null);
		});

	//On mouse move increase or decrease the number of bins.    	
	function UpdateBins() {
		//d3. keys to classify categorical vs numerical.
		if( keys.length > 20 && (bins < 70) && d3.mouse(mydiv.node())[0] + 20 < x_pos){
			//Clear previous svg element
			d3.select("#svgid").remove();
			//Standard code to create new svg element
			var svg = d3.select("body").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.topp + margin.bottom)
				.attr("id","svgid")
				.attr("class","svg")
			  .append("g")
				.attr("transform", 
					  "translate(" + margin.left + "," + margin.topp + ")");
			//Change in number of bins	  
			bins += 5;
			//Calling myBin function to draw a new histogram
			myBin(bins,svg);
			//Update x position afterwards.
			x_pos = d3.mouse(mydiv.node())[0];
		}
		//Setting max bins to 70
		else if(keys.length > 20 && d3.mouse(mydiv.node())[0] - 20 > x_pos && bins > 1){
			//Same logic as previous if.
			d3.select("#svgid").remove();
			var svg = d3.select("body").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.topp + margin.bottom)
				.attr("id","svgid")
				.attr("class","svg")
			  .append("g")
				.attr("transform", 
					  "translate(" + margin.left + "," + margin.topp + ")");
			bins -= 5;
			myBin(bins,svg);
			x_pos = d3.mouse(mydiv.node())[0];
		}
	}
}); 
