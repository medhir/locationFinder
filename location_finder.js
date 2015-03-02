/*
** Script for finding nearest office location from user input
*/

var offices = [
	{
		name: "Apopka",
		address: "201 North Park Avenue Apopka, FL 32703",
		phone: "(407) 339-4447"
	},
	{
		name: "Altamonte Springs",
		address: "685 Palm Springs Drive Altamonte Springs, FL 32701",
		phone: "(407) 339-4447"
	},
	{
		name: "Florida Hospital South",
		address: "2501 N. Orand Avenue Orlando, FL 32804",
		phone: "(407) 894-4693"
	},
	{
		name: "Goldenrod",
		address: "3727 N. Goldenrod Road Winter Park, FL 32792",
		phone: "(407) 657-0296"
	},
	{
		name: "Kissimmee",
		address: "1101 N. Central Avenue Kissimmee, FL 32741",
		phone: "407-933-2210"
	},
	{
		name: "Lake Mary",
		address: "766 Sun Drive Lake Mark, FL 32746",
		phone: "407-440-2800"
	},
	{
		name: "Metric",
		address: "4100 Metric Drive Winter Park, FL 32794",
		phone: "407-681-8720"
	},
	{
		name: "Oakwater",
		address: "3885 Oakwater Circle Orlando, FL 32806",
		phone: "407-851-5600"
	},
	{
		name: "Ocoee",
		address: "1552 Boren Drive Ocoee, FL 34761",
		phone: "407-905-8172"
	},
	{
		name: "Sandlake",
		address: "7484 Doc's Grove Circle Orlando, FL 32819",
		phone: "407-722-8270"
	},
	{
		name: "Vascular Lab - North",
		address: "337 S. North Lake Blvd. Altamonte Springs, FL 32701",
		phone: "407-515-2230"
	},
	{
		name: "Vascular Lab - South",
		address: "1511 Sligh Blvd. Orlando, FL 32806",
		phone: "407-472-5120"
	},
	{
		name: "Waterford Lakes",
		address: "11317 Lake Underhill Road Orlando, FL 32825",
		phone: "207-515-2250"
	},
	{
		name: "Poinciana",
		address: "1012 Cypress Parkway Poinciana, FL 34759",
		phone: "407-279-5428"
	},
	{
		name: "Metrowest",
		address: "6320 Old Winter Garden Road Orlando, FL 32835"
	},
	{
		name: "Dr. Phillips",
		address: "7319 Stonerock Circle Orlando, FL 32819"
	}];

//extract address property from objects in offices array
var addresses = offices.map(function(office) {
	return office.address;
});

var directionsDisplay;
//API call to google maps API Distance Matrix service
var service = new google.maps.DistanceMatrixService();
//API call to google maps API Directions service
var directionsService = new google.maps.DirectionsService();
var map;

//initialize map
function initialize() {
	directionsDisplay = new google.maps.DirectionsRenderer();
	var orlando = new google.maps.LatLng(28.4158, -81.2989);
	var mapOptions = {
		zoom: 9, 
		center: orlando
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	directionsDisplay.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);



function getDirections() {
	//extract patient address 
	var patientAddress = document.getElementById("patientAddress").value;

	if(patientAddress == '')
		alert("Please use a valid address");
	else {
		var distances = [];
		var origin = patientAddress;

		service.getDistanceMatrix(
		{
			origins: [origin],
			destinations: addresses,
			travelMode: google.maps.TravelMode.DRIVING,
			unitSystem: google.maps.UnitSystem.IMPERIAL
		}, getDistances);

		function getDistances(response, status) {
			if(status == google.maps.DistanceMatrixStatus.OK) {

				var origins = response.originAddresses;
				var destinations = response.destinationAddresses;

				for(var i = 0; i < origins.length; i++) {
					var results = response.rows[i].elements;
					for(var j = 0; j < results.length; j++) {
						var element = results[j];
						var dist = parseFloat(element.distance.text);
						distances.push({
							address: destinations[j],
							distance: dist
						});
					}
				}

				console.log(distances);

				//find shortest distance
				var findMinDistance = function(distances) {
					var minDistObj = distances[0];
					for(var i = 1; i < distances.length; i++)
					{
						if(distances[i].distance < minDistObj.distance)
							minDistObj = distances[i];
					}
					return minDistObj;	
				};

				//use shortest distance to calculate directions to nearest office

				var minDistance = findMinDistance(distances);

				function calcRoute() {
					var start = patientAddress;
					var end = minDistance.address;
					var request = {
						origin: start, 
						destination: end,
						travelMode: google.maps.TravelMode.DRIVING, 
						unitSystem: google.maps.UnitSystem.IMPERIAL
					};
					directionsService.route(request, function(result, status) {
						if (status == google.maps.DirectionsStatus.OK) {
							directionsDisplay.setDirections(result);
						}
					});
				}

				calcRoute();
			}
		}

		/*
		//find shortest distance
		var findMinDistance = function(distances) {
			var minDist = {};
			for(var i = 0; i < distances.length; i++)
			{
				if(distances[i].distance < distances[i+1].distance)
					minDistObj = distances[i];
				else
					minDistObj = distances[i+1];
			}
			return minDistObj;	
		};

		//use shortest distance to calculate directions to nearest office

		var minDistance = findMinDistance(distances);

		console.log(minDistance);

		function calcRoute() {
			var start = patientAddress;
			var end = minDistance.address;
			var request = {
				origin: start, 
				destination: end,
				travelMode: google.maps.TravelMode.DRIVING, 
				unitSystem: google.maps.UnitSystem.IMPERIAL
			};
			directionsService.route(request, function(result, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					directionsDisplay.setDirections(result);
				}
			});
		}

		calcRoute();
		*/
	}	
}