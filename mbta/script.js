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
					title: "I am here"
				});
				marker.setMap(map);
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(marker.title);
					infowindow.open(map, marker);
				});
			});
		}
		else
			alert("Geolocation is not supported by your web browser.");
}