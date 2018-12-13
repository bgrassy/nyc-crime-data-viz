// Dropdown menu functionality
d3.selectAll(".dropbutton")
	.on("click", function() {
		drop = d3.select(this.parentNode).selectAll(".dropdown")
		drop.classed("show", drop.classed("show") ? false : true);
	});
