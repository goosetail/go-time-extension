(function goTimeDisplay(){
	var display;
	var locationsList;

	function initDOM(){
		display = document.createElement('div')
		display.id = 'go-time-display';

		locationsList = document.createElement('ul');
		locationsList.id = 'locations-list';

		display.appendChild(locationsList);

		document.body.appendChild(display);
	}

	function addEventListeners(){

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	    if (request.name === 'updateRoutes') {
	    	updateRoutes(request.data);
	    }
		});

	}

	function getRoutes(){
		chrome.runtime.sendMessage({name: 'getRoutes'}, function(response){
			if(response && response.data){
				updateRoutes(response.data);
			}
		});
	}

	function updateRoutes(routes){
		locationsList.innerHTML = '';

		for(var i = 0; i < routes.length; i++){
			addRoute(routes[i]);
		}
	}

	function addRoute(route){
		var li = document.createElement('li');

		var routeLink = document.createElement('a');
		routeLink.className = 'route-link';

		var startAddress = route.legs[0].start_address;
		var endAddress = route.legs[0].end_address;

		routeLink.href = 'https://maps.google.com?saddr='+startAddress+'&daddr='+endAddress;

		var duration = route.legs[0].duration.text;
		var durationText = document.createTextNode(duration);

		routeLink.appendChild(durationText);
		li.appendChild(routeLink);

		locationsList.appendChild(li)
	}

	initDOM();
	addEventListeners();
	getRoutes();

})(); 

