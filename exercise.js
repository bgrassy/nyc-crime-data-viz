// Define icons for leaflet maps
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

// Constructs the line plot for crime frequencies
class LinePlot {
 	constructor(id, fel_counts, vio_counts, mis_counts) {
 		this.svg = d3.select("#" + id);

 		// make sure that svg is clear at the start of each call
 		this.svg.selectAll("*").remove();

 		// hold the counts for each hour
 		let fel_data = new Array();
 		let vio_data = new Array();
 		let mis_data = new Array();
 		let total_data = new Array();

 		let i;
 		// converts arrays to dictionaries
 		for (i = 0; i < 24; i++) {
 			fel_data.push({'x' : i, 'y': fel_counts[i]});
 			vio_data.push({'x' : i, 'y': vio_counts[i]});
 			mis_data.push({'x' : i, 'y': mis_counts[i]});
 			total_data.push({'x' : i, 'y': (fel_counts[i] + vio_counts[i] + mis_counts[i])});
 		}

 		// scale for x-axis of plot
 		let x = d3.scaleLinear()
 		.domain([d3.min(total_data, function(d) { return d.x; }), 
 			d3.max(total_data, function(d) { return d.x; })])
 		.range([30, 485]);

 		// scale for y-axis of plot
 		let y = d3.scaleLinear()
            //.domain([d3.min(data, function(d) { return d.y; }), 
            .domain([d3.max(total_data, function(d) { return d.y; }), 0])
            .range([0, 300]);

        // function that generates line charts
	    let lineFunction = d3.line()
	            .x(function(d) { return x(d.x); })
	            .y(function(d) { return y(d.y); })
	            .curve(d3.curveLinear);

	    // axes for the graphs
	    var x_axis = d3.axisBottom().scale(x);
	    var y_axis = d3.axisLeft().scale(y);

	    // adds axes to the graph
	    this.svg.append("g").attr("transform", "translate(0, 300)").call(x_axis);
	    this.svg.append("g").attr("transform", "translate(30, 0)").call(y_axis);

	    // appends the title
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

		// plots felony data
		this.svg.append("path").attr("d", lineFunction(fel_data))
			.attr("stroke", "red")
			.attr("stroke-width", 2.5)
			.attr("fill", "none");

		// plots misdemeanor data
		this.svg.append("path").attr("d", lineFunction(mis_data))
			.attr("stroke", "orange")
			.attr("stroke-width", 2.5)
			.attr("fill", "none");

		// plots violation data
		this.svg.append("path").attr("d", lineFunction(vio_data))
			.attr("stroke", "yellow")
			.attr("stroke-width", 2.5)
			.attr("fill", "none");

		// plots total data
		this.svg.append("path").attr("d", lineFunction(total_data))
			.attr("stroke", "black")
			.attr("stroke-width", 2.5)
			.attr("fill", "none");
	}	
}

// Constructs the line plot for crime frequencies
class BarPlot {
	constructor(id, counts) {
		this.svg = d3.select("#" + id);

 		// make sure that svg is clear at the start of each call
 		this.svg.selectAll("*").remove();

 		// array that holds crime/count pairs
 		let data = new Array();

 		for (var obj in counts) {
 			data.push({
 				"name": obj,
 				"value": counts[obj],
 			});
 		}

 		// sorts the data by most counts, selects first fifteen
 		data.sort((a, b) => b.value - a.value)
 		data = data.slice(0, Math.min(15, data.length));

 		// scales the height by proper amount
 		let height = 250 / data.length;

 		// encodes index information for each bar
 		for (let i in data) {
 			data[i]["i"] = height * i;
 		}

 		// x-axis scale
 		let x = d3.scaleLinear()
 		.domain([0, d3.max(data, function(d) { return d.value; })])
 		.range([200, 500]);

 		// y-axis scale
 		let y = d3.scaleLinear()
            .domain([d3.max(data, function(d) { return d.value; }), 0])
            .range([50, 300]);

        // draws all the bars
	    this.svg.append("g")
	            .attr("fill", "steelblue")
	            .selectAll("rect").data(data).enter().append("rect")
	            .attr("x", d => 150)
	            .attr("y", d => d.i + 20)
	            .attr("height", height - 3)
	            .attr("width", d => x(d.value) - x(0));

	    // adds labels for bars
	    this.svg.selectAll("text").data(data).enter().append("text")
	            .attr("x", 0)             
	            .attr("y", function (d) {
	            	return d.i + ((height - 3) / 2) + 22;
	            })
	            .attr("text-anchor", "left")  
	            .style("font-size", "8px") 
	            .text(function(d) { return d.name });

	    var x_axis = d3.axisBottom().scale(x);

	    // adds x-axis
	    this.svg.append("g").attr("transform", "translate(-50, 270)").call(x_axis);

	    // y-axis label
	    this.svg.append("text")
	            .attr("x", 300)             
	            .attr("y", 10)
	            .attr("text-anchor", "middle")  
	            .style("font-size", "13px") 
	            .style("text-decoration", "underline")  
	            .text("Frequency of Crimes Committed");

		// x-axis label
		this.svg.append("text")
			.attr("x", 300)             
			.attr("y", 297)
			.attr("text-anchor", "middle")  
			.style("font-size", "11px") 
			.text("Number of Crimes");
	}
}

// Main data collection. Collects data for the given date, returning layers with the 
// correct markers on them.
function getCSVData(date, month, year) {
	// array of all the layers that will go on the map. Initialize to empty.
	let layers = new Array();
	for (let i = 0; i < 72; i++) {
		layers.push(L.layerGroup());
	}

	d3.json("https://data.cityofnewyork.us/resource/9s4h-37hy.json?"
		+ "$select=cmplnt_fr_dt,cmplnt_fr_tm,law_cat_cd,ofns_desc,latitude,longitude,boro_nm"
		+ "&$where=date_extract_y(cmplnt_fr_dt)=" + year
		+ "and date_extract_m(cmplnt_fr_dt)=" + month
		+ "and date_extract_d(cmplnt_fr_dt)=" + date
		+ "&$limit=2000"
		+ "&$$app_token=8QC85EOlIUQSUNi4lWPQvssHx"
		).then(function (data) {
			// creates three arrays filled with 24 zeros
			let fel_counts = Array.apply(null, Array(24)).map(function (x, i) { return 0; });
			let vio_counts = Array.apply(null, Array(24)).map(function (x, i) { return 0; });
			let mis_counts = Array.apply(null, Array(24)).map(function (x, i) { return 0; });

			// holds counts for each crime
			let counts = {};

			data.forEach(function(d) {
				// generates date-time object
				d.Date = new Date(d.cmplnt_fr_dt.substring(0, 11) + d.cmplnt_fr_tm)

				// update crime counts
				if (!(d.ofns_desc in counts)) {
					counts[d.ofns_desc] = 0;
				}
				counts[d.ofns_desc]++;

				// creates marker, adds it to proper layer (combination of time and severity)
				let marker = L.marker([+d.latitude, +d.longitude], { icon: toColor(d.law_cat_cd) }).bindPopup(d.ofns_desc);
				if (d.law_cat_cd == "FELONY") {
					marker.addTo(layers[d.Date.getHours()]);
					fel_counts[d.Date.getHours()]++;
				} else if (d.law_cat_cd == "MISDEMEANOR") {
					marker.addTo(layers[24 + d.Date.getHours()]);
					mis_counts[d.Date.getHours()]++;
				} else {
					marker.addTo(layers[48 + d.Date.getHours()]);
					vio_counts[d.Date.getHours()]++;
				}
			}); 

			// plots the line plot and the bar plot
			const plot1 = new LinePlot("plot", fel_counts, vio_counts, mis_counts);
			const plot2 = new BarPlot("barplot", counts);
		});
	return layers;
}

// for a crime type, adds all layers associated to that crime
function addCrimeLayer(offset, layers, mymap) {
	for (let i = 0; i < 24; i++) {
		mymap.addLayer(layers[offset + i]);
	}	
}

// For an hour, adds layer corresponding to all three crime types
function addTimeLayer(hour, layers, mymap) {
	for (let i = 0; i < 3; i++) {
		mymap.addLayer(layers[24 * i + hour]);
	}
}

// for a crime type, removes all layers associated to that crime
function removeCrimeLayer(offset, layers, mymap) {
	for (let i = 0; i < 24; i++) {
		let l = layers[offset + i];
		if (mymap.hasLayer(l)) {
			console.log(i);
			mymap.removeLayer(l);
		}
	}
}

// For an hour, removes layer corresponding to all three crime types
function removeTimeLayer(hour, layers, mymap) {
	for (let i = 0; i < 3; i++) {
		let l = layers[24 * i + hour];
		if (mymap.hasLayer(l)) {
			mymap.removeLayer(l);
		}
	}
}

// adds listener to given id'd checkbox corresponding to given layers
function addCrimeListener(id, offset, layers, mymap) {
	const checkbox = document.getElementById(id)

	checkbox.addEventListener('change', (event) => {
		if (event.target.checked) {
			addCrimeLayer(offset, layers, mymap);
		} else {
			removeCrimeLayer(offset, layers, mymap);
		}
	})
}

// adds listener to date-time boxes
function addStartListener(start_id, end_id, layers, mymap) {
	const s = document.getElementById(start_id);
	const e = document.getElementById(end_id);

	s.addEventListener('change', (event) => {
		let start = parseInt(event.target.value);
		let oldStart = parseInt(event.target.defaultValue);
		let end = parseInt(e.value);
		if (start >= 0 && start < 24 && start <= end) {
			event.target.defaultValue = start;
    if (oldStart < start) { // start time moved later
    	for (let i = oldStart; i < start; i++) {
    		removeTimeLayer(i, layers, mymap);
    	}
    } else if (start < oldStart) {
    	for (let i = oldStart; i > start; i--) {
    		addTimeLayer(i, layers, mymap);
    	}
    }
  } else {
  	event.target.value = oldStart;
  }
});
}

// adds listener to date-time boxes
function addEndListener(start_id, end_id, layers, mymap) {
	const s = document.getElementById(start_id);
	const e = document.getElementById(end_id);

	e.addEventListener('change', (event) => {
		let end = parseInt(event.target.value);
		let oldEnd = parseInt(event.target.defaultValue);
		let start = parseInt(s.value);
		if (end >= 0 && end < 24 && start <= end) {
			event.target.defaultValue = end;
			console.log(end);
			console.log(oldEnd);
	    if (oldEnd < end) { // end moved later
	    	for (let i = oldEnd; i < end; i++) {
	    		addTimeLayer(i, layers, mymap);
	    	}
	    } else if (end < oldEnd) {
	    	for (let i = oldEnd; i > end; i--) {
	    		removeTimeLayer(i, layers, mymap);
	    	}
	    }
	  } else {
	  	event.target.value = oldEnd;
	  }
	});
}

// plots all of the markers to the map
function plotData(layers, mymap) {
	for (let i = 0; i < 72; i++) {
		layers[i].addTo(mymap);
	}

	addCrimeListener("felonies", 0, layers, mymap);
	addCrimeListener("misdemeanors", 24, layers, mymap);
	addCrimeListener("violations", 48, layers, mymap);
	addStartListener("start", "end", layers, mymap);
	addEndListener("start", "end", layers, mymap);	
}


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
		main();
	}
}

whenDocumentLoaded(() => {
	// creates map
	var mymap = L.map('mapid').setView([40.7128, -73.9], 12);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1IjoiYmdyYXNzeSIsImEiOiJjam90M283enMwM2d1M3ZvZGRweXhuZXdwIn0.OOZ5ruMJLs3hrovEkbYcjg'
	}).addTo(mymap);

	// gets date from date picker
	const date = document.getElementById("date");

	// when date changed, load data again
	date.addEventListener('change', (event) => {
		let inputDate = new Date(event.target.value);
		let year = inputDate.getFullYear();
		if (year >= 2006 && year <= 2017) { // checks if date valid
			mymap.eachLayer(function (layer) { // resets map
				mymap.removeLayer(layer);
			});
			L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
				attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox.streets',
				accessToken: 'pk.eyJ1IjoiYmdyYXNzeSIsImEiOiJjam90M283enMwM2d1M3ZvZGRweXhuZXdwIn0.OOZ5ruMJLs3hrovEkbYcjg'
			}).addTo(mymap);
			
			let data = getCSVData(inputDate.getDate(), inputDate.getMonth() + 1, year);
			plotData(data, mymap);
		}
  	//plotData(data, mymap);
	});

	let data = getCSVData(5, 12, 2013);
	plotData(data, mymap);
	// plot object is global, you can inspect it in the dev-console
});
