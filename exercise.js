
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


function getCSVData() {
	let felonies = L.layerGroup();
	let violations = L.layerGroup();
	let misdemeanors = L.layerGroup();

	d3.csv("felonies.csv", function(data) {
	  if (data.LAW_CAT_CD == "FELONY") {
	    L.marker([+data.Latitude, +data.Longitude], { icon: toColor(data.LAW_CAT_CD) }).bindPopup(data.OFNS_DESC).addTo(felonies);
	  } else if (data.LAW_CAT_CD == "VIOLATION") {
	  	L.marker([+data.Latitude, +data.Longitude], { icon: toColor(data.LAW_CAT_CD) }).bindPopup(data.OFNS_DESC).addTo(violations);
	  } else {
	  	L.marker([+data.Latitude, +data.Longitude], { icon: toColor(data.LAW_CAT_CD) }).bindPopup(data.OFNS_DESC).addTo(misdemeanors);
	  }
	});
	return [felonies, violations, misdemeanors];
}

function plotData() {
	data = getCSVData();

	let felonies = data[0];
	let violations = data[1];
	let misdemeanors = data[2];
	console.log(data[0]);

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
