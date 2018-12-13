d3.select(".dropbutton")
	.on("click", function() {
		d3.select(".dropdown").classed("show", 
			d3.select(".dropdown").classed("show") ? false : true);
	});
