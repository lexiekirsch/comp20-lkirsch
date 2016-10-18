var map;
var marker;
var image = "MBTA.jpg";
var infowindow = new google.maps.InfoWindow();

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 42.3601, lng: -71.0589}, /* Boston */
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    addMe();
    addStops();
}

function addMe() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			me = new google.maps.LatLng(myLat, myLng);
			map.panTo(me); /* centers map on your location */
			marker = new google.maps.Marker({
				position: {lat: myLat, lng: myLng},
				title: findClosestStop()
			});
			marker.setMap(map);
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(marker.title);
				infowindow.open(map, marker);
				addLineTo(closestCoord);
			});
		});
	}
	else
		alert("Geolocation is not supported by your web browser.");
}


function addStops() {
    stops = [
      	['Alewife',42.395428,-71.142483],
		['Davis', 42.39674, -71.121815],
		['Porter Square', 42.3884, -71.11914899999999],
		['Harvard Square', 42.373362, -71.118956],
		['Central Square', 42.365486, -71.103802],
		['Kendall/MIT', 42.36249079, -71.08617653],
		['Charles/MGH', 42.361166, -71.070628],
		['Park Street', 42.35639457, -71.0624242],
		['Downtown Crossing', 42.355518, -71.060225],
  		['South Station', 42.352271, -71.05524200000001],
  		['Broadway', 42.342622, -71.056967],
	 	['Andrew', 42.330154, -71.057655],
  		['JFK/UMass', 42.320685, -71.052391],
  		/* fork --> go to the left */
  		['Savin Hill', 42.31129, -71.053331],
  		['Fields Corner', 42.300093, -71.061667],
  		['Shawmut', 42.29312583, -71.06573796000001],
  		['Ashmont', 42.284652, -71.06448899999999],
  		/* return to fork */
		['Shawmut', 42.29312583, -71.06573796000001],
  		['Fields Corner', 42.300093, -71.061667],
  		['Savin Hill', 42.31129, -71.053331],
  		['JFK/UMass', 42.320685, -71.052391],
  		/* fork --> go to the right */
  		['North Quincy', 42.275275, -71.029583],
		['Wollaston', 42.2665139, -71.0203369],
		['Quincy Center', 42.251809, -71.005409],
  		['Quincy Adams', 42.233391, -71.007153],
  		['Braintree', 42.2078543, -71.0011385]
	];

	for (var i = 0; i < stops.length; i++) {
		var stop = stops[i];
		var marker = new google.maps.Marker({
				position: {lat: stop[1], lng: stop[2]},
				map: map,
				icon: image,
				title: stop[0]
		});
		marker.setMap(map);
		addInfoWindowToStop(marker);
	}

	function addInfoWindowToStop(marker) {
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(marker.title);
			infowindow.open(map, marker);
		});
	}

	for (var i = 0; i < stops.length -1; i++) {
		var path = [
			{ lat: stops[i][1],   lng: stops[i][2] }, 
			{ lat: stops[i+1][1], lng: stops[i+1][2] }
		]

		var line = new google.maps.Polyline({
			path: path,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
		line.setMap(map);
	}
}

function findClosestStop() {
	myCoord = [myLat, myLng];
	nextCoord = [stops[0][1], stops[0][2]];
	closestCoord = [stops[0][1], stops[0][2]];
	d = haversineDistance(myCoord, nextCoord);
	stopname = stops[0][0];
	
	for (var i = 0; i < stops.length; i++) {
		nextCoord = [stops[i][1], stops[i][2]];
		distance = haversineDistance(myCoord, nextCoord);
		if (distance < d) {
			d = distance;
			stopname = stops[i][0];
			closestCoord = [stops[i][1], stops[i][2]];
		}
	}
	return "Nearest station is " + stopname + ", which is " + d + " miles away";
}

/* Modified from http://stackoverflow.com/questions/14560999/using-the-haversine-formula-in-javascript */
function haversineDistance(coords1, coords2) {
	/* coords in the form [latitude, longitude] */
  	function toRad(x) {
    	return x * Math.PI / 180;
  	}

  	var lat1 = coords1[0];
  	var lon1 = coords1[1];
  	var lat2 = coords2[0];
  	var lon2 = coords2[1];

  	var R = 6371; // km

	var x1   = lat2 - lat1;
  	var dLat = toRad(x1);
  	var x2   = lon2 - lon1;
  	var dLon = toRad(x2)

  	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    	Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    	Math.sin(dLon / 2) * Math.sin(dLon / 2);
  	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  	var d = R * c;

	d /= 1.60934;
  	return d;
}

function addLineTo(coord) {
	var path = [
		{ lat: myLat,    lng: myLng }, 
		{ lat: coord[0], lng: coord[1] }
	]

	var line = new google.maps.Polyline({
		path: path,
		strokeColor: '#0000FF',
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	
	line.setMap(map);
}
