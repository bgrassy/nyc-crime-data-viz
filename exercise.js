
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
 	} else if (str == "VIOLATION") {
 		return orangeIcon;
 	} else { // misdemeanor
 		return yellowIcon;
 	}
 }

 class ScatterPlot {
	/* your code here */
    constructor(id, rows) {
        this.svg = d3.select("#" + id);
        let data = new Array();
        let i;
        for (i = 0; i < 24; i++) {
        	data.push({'x' : i, 'y': rows[i]});
        }
        let x = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return d.x; }), 
                     d3.max(data, function(d) { return d.x; })])
            .range([30, 500]);

        let y = d3.scaleLinear()
            //.domain([d3.min(data, function(d) { return d.y; }), 
            .domain([d3.max(data, function(d) { return d.y; }), 0])
            .range([0, 300]);

        let lineFunction = d3.line()
                         .x(function(d) { return x(d.x); })
                         .y(function(d) { return y(d.y); })
                         .curve(d3.curveLinear);

        var x_axis = d3.axisBottom().scale(x);
        var y_axis = d3.axisLeft().scale(y);

        this.svg.append("g").attr("transform", "translate(0, 300)").call(x_axis);
        this.svg.append("g").attr("transform", "translate(30, 0)").call(y_axis);

        this.svg.append("path").attr("d", lineFunction(data))
        		.attr("stroke", "blue")
        		.attr("fill", "none");
    }

    
}


function getCSVData() {
	let felonies = L.layerGroup();
	let violations = L.layerGroup();
	let misdemeanors = L.layerGroup();

	d3.csv("felonies.csv").then(function(data) {
	  counts = Array.apply(null, Array(24)).map(function (x, i) { return 0; })
	  data.forEach(function(d) {
	  	  d.Date = new Date(d.Date);
	  	  counts[d.Date.getHours()]++;
		  if (d.LAW_CAT_CD == "FELONY") {
		    L.marker([+d.Latitude, +d.Longitude], { icon: toColor(d.LAW_CAT_CD) }).bindPopup(d.OFNS_DESC).addTo(felonies);
		  } else if (d.LAW_CAT_CD == "VIOLATION") {
		  	L.marker([+d.Latitude, +d.Longitude], { icon: toColor(d.LAW_CAT_CD) }).bindPopup(d.OFNS_DESC).addTo(violations);
		  } else {
		  	L.marker([+d.Latitude, +d.Longitude], { icon: toColor(d.LAW_CAT_CD) }).bindPopup(d.OFNS_DESC).addTo(misdemeanors);
		  }
	  }); 

	  console.log("yeet");
	  const plot = new ScatterPlot("plot", counts);
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
		"Violations": violations,
		"Misdemeanors": misdemeanors
	}
	L.control.layers(null, markers).addTo(mymap);
}

whenDocumentLoaded(() => {
	plotData();
	// plot object is global, you can inspect it in the dev-console
});
