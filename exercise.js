
/*
	Run the action when we are sure the DOM has been loaded
	https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded
	Example:
	whenDocumentLoaded(() => {
		console.log('loaded!');
		document.getElementById('some-element');
	});
*/
function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", action);
	} else {
		// `DOMContentLoaded` already fired
		action();
	}
}
 
 var redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

 var orangeIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

 var yellowIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

 function toColor(str) {
 	if (str == "FELONY") {
 		return redIcon;
 	} else if (str == "MISDEMEANOR") {
 		return orangeIcon;
 	} else { // violation
 		return yellowIcon;
 	}
 }

 class ScatterPlot {
	/* your code here */
    constructor(id, fel_counts, vio_counts, mis_counts) {
        this.svg = d3.select("#" + id);
        let fel_data = new Array();
        let vio_data = new Array();
        let mis_data = new Array();
        let total_data = new Array();
        let i;
        for (i = 0; i < 24; i++) {
        	fel_data.push({'x' : i, 'y': fel_counts[i]});
        	vio_data.push({'x' : i, 'y': vio_counts[i]});
        	mis_data.push({'x' : i, 'y': mis_counts[i]});
        	total_data.push({'x' : i, 'y': (fel_counts[i] + vio_counts[i] + mis_counts[i])});
        }
        console.log(fel_data);
        console.log(vio_data);
        console.log(mis_data);
        console.log(total_data);
        let x = d3.scaleLinear()
            .domain([d3.min(total_data, function(d) { return d.x; }), 
                     d3.max(total_data, function(d) { return d.x; })])
            .range([30, 500]);

        let y = d3.scaleLinear()
            //.domain([d3.min(data, function(d) { return d.y; }), 
            .domain([d3.max(total_data, function(d) { return d.y; }), 0])
            .range([0, 300]);

        let lineFunction = d3.line()
                         .x(function(d) { return x(d.x); })
                         .y(function(d) { return y(d.y); })
                         .curve(d3.curveLinear);

        var x_axis = d3.axisBottom().scale(x);
        var y_axis = d3.axisLeft().scale(y);

        this.svg.append("g").attr("transform", "translate(0, 300)").call(x_axis);
        this.svg.append("g").attr("transform", "translate(30, 0)").call(y_axis);
        
        this.svg.append("text")
		        .attr("x", 250)             
		        .attr("y", -20)
		        .attr("text-anchor", "middle")  
		        .style("font-size", "16px") 
		        .style("text-decoration", "underline")  
		        .text("Time of Day vs Crimes Committed");

		// x-axis label
		this.svg.append("text")
		        .attr("x", 250)             
		        .attr("y", 330)
		        .attr("text-anchor", "middle")  
		        .style("font-size", "12px") 
		        .text("Hour of the Day");

		// y-axis label
		this.svg.append("text")
		        .attr("x", -150)             
		        .attr("y", 0)
		        .attr("text-anchor", "middle")  
		        .style("font-size", "12px") 
		        .attr("transform", "rotate(-90)")
		        .text("Number of Crimes Committed");

        this.svg.append("path").attr("d", lineFunction(fel_data))
        		.attr("stroke", "red")
        		.attr("stroke-width", 2.5)
        		.attr("fill", "none");

		this.svg.append("path").attr("d", lineFunction(mis_data))
        		.attr("stroke", "orange")
        		.attr("stroke-width", 2.5)
        		.attr("fill", "none");

        this.svg.append("path").attr("d", lineFunction(vio_data))
        		.attr("stroke", "yellow")
        		.attr("stroke-width", 2.5)
        		.attr("fill", "none");

		this.svg.append("path").attr("d", lineFunction(total_data))
        		.attr("stroke", "black")
        		.attr("stroke-width", 2.5)
        		.attr("fill", "none");
    }

    
}


function getCSVData() {
	let felonies = L.layerGroup();
	let violations = L.layerGroup();
	let misdemeanors = L.layerGroup();

	d3.csv("felonies.csv").then(function(data) {
	  let fel_counts = Array.apply(null, Array(24)).map(function (x, i) { return 0; });
	  let vio_counts = Array.apply(null, Array(24)).map(function (x, i) { return 0; });
	  let mis_counts = Array.apply(null, Array(24)).map(function (x, i) { return 0; });
	  data.forEach(function(d) {
	  	  d.Date = new Date(d.Date);
		  if (d.LAW_CAT_CD == "FELONY") {
		    L.marker([+d.Latitude, +d.Longitude], { icon: toColor(d.LAW_CAT_CD) }).bindPopup(d.OFNS_DESC).addTo(felonies);
		    fel_counts[d.Date.getHours()]++;
		  } else if (d.LAW_CAT_CD == "MISDEMEANOR") {
		  	L.marker([+d.Latitude, +d.Longitude], { icon: toColor(d.LAW_CAT_CD) }).bindPopup(d.OFNS_DESC).addTo(misdemeanors);
		  	mis_counts[d.Date.getHours()]++;
		  } else {
		  	L.marker([+d.Latitude, +d.Longitude], { icon: toColor(d.LAW_CAT_CD) }).bindPopup(d.OFNS_DESC).addTo(violations);
		  	vio_counts[d.Date.getHours()]++;
		  }
	  }); 

	  console.log("yeet");
	  const plot = new ScatterPlot("plot", fel_counts, vio_counts, mis_counts);
	});
	return [felonies, violations, misdemeanors];
}

function plotData() {
	data = getCSVData();

	let felonies = data[0];
	let violations = data[1];
	let misdemeanors = data[2];
	let rows = data[3];

	var mymap = L.map('mapid').setView([40.7128, -73.9], 12);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	    maxZoom: 18,
	    id: 'mapbox.streets',
	    accessToken: 'pk.eyJ1IjoiYmdyYXNzeSIsImEiOiJjam90M283enMwM2d1M3ZvZGRweXhuZXdwIn0.OOZ5ruMJLs3hrovEkbYcjg'
	}).addTo(mymap);

	felonies.addTo(mymap);
	violations.addTo(mymap);
	misdemeanors.addTo(mymap);

	var markers = {
		"Felonies": felonies,
		"Misdemeanors": misdemeanors,
		"Violations": violations
	}
	L.control.layers(null, markers).addTo(mymap);
}

whenDocumentLoaded(() => {
	plotData();
	// plot object is global, you can inspect it in the dev-console
});
