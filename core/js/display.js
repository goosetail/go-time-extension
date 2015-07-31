(function goTimeDisplay(){
	var display;
	var routeList;

	console.log('script loaded');

	function initDOM(){
		console.log('init dom');

		var display = document.createElement('div')
		display.id = 'go-time-display';

		var routeList = document.createElement('ul');
		routeList.id = 'route-list';

		display.appendChild(routeList);

		document.body.appendChild(display);

	}

	function addEventListeners(){

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	    if (request.name === 'updateRoutes') {
	    	updateRoutes(request.data);
	    }
	    else if (request.name === 'addRoute') {
	    	addRoute(request.data);
	    }
	    else if (request.name === 'removeRoute') {
	    	removeRoute(request.data);
	    }
		});

	}

	function getRoutes(){

		chrome.runtime.sendMessage({name: 'getRoutes'}, function(response){
			if(response && response.data){
				createRoutes(response.data);
			}
		});

	}

	function updateRoutes(routes){
		for(var i = 0; i < routes.length; i++){
			updateRoute(routes[i]);
		}
	}

	function createRoutes(routes){
		console.log('create routes')
		console.log(routes);
		for(var i = 0; i < routes.length; i++){
			addRoute(routes[i]);
		}
	}

	function addRoute(route){
		console.log('adding routes');
		if(!routeList){
			routeList = document.getElementById('route-list');
		}

		var li = document.createElement('li');
		li.id = formatRouteId(route.location.label);

		var routeLink = document.createElement('a');
		routeLink.className = 'route-link';

		var startAddress = route.data.legs[0].start_address;
		var endAddress = route.data.legs[0].end_address;

		routeLink.href = 'https://maps.google.com?saddr='+startAddress+'&daddr='+endAddress;

		var duration = route.data.legs[0].duration.text;
		var durationText = document.createTextNode(duration);

		routeLink.appendChild(durationText);
		li.appendChild(routeLink);

		routeList.appendChild(li);

	}

	function updateRoute(route){
		console.log(routeList);
		if(!routeList){
			routeList = document.getElementById('route-list');
		}

		var routeId = formatRouteId(route.location.label);
		var routeEl = routeList.querySelector('#' + routeId);

		if(routeEl){
			var routeLink = routeEl.querySelector('.route-link');
		
			while(routeLink.lastChild){
				routeLink.removeChild(routeLink.lastChild);
			}

			var duration = route.data.legs[0].duration.text;
			var durationText = document.createTextNode(duration);

			routeLink.appendChild(durationText);
		}
		
	}

	function removeRoute(route){
		if(!routeList){
			routeList = document.getElementById('route-list');
		}

		var routeId = formatRouteId(route.location.label);
		var routeEl = routeList.querySelector('#' +routeId);

		routeList.removeChild(routeEl);
	}

	function formatRouteId(label){
		return label.toLowerCase().replace(/\s/g, '-') + '-route';
	}

	initDOM();

	// wait for our dom to be inserted before attaching events
	setTimeout(function(){
		addEventListeners();
		getRoutes();
	},0)

})(); 

