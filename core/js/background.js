var locations = [];
var routes = [];
var directionsService = new google.maps.DirectionsService();

function calculateAllRoutes(){

  chrome.storage.sync.get('locations', function(data){
    
    if(data && data.locations && data.locations.length){
      locations = data.locations;
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
      }

      function successFunction(position) {

        var start = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        for(var i = 0; i < data.locations.length; i++){

          var end = new google.maps.LatLng(data.locations[i].coordinates.A, data.locations[i].coordinates.F);

          calculateRoute(data.locations[i], start, end);
        }
      }

      function errorFunction(err){
        alert('We could not determine where you are. That makes things rather difficult you see.');
      }
    }
    else{
      updateDisplay()
    }
  })
}

function calculateRoute(location, start, end){
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  };

  directionsService.route(request, function(result, status) {
    if(result && result.routes.length) {
      route = {
        location: location,
        data: result.routes[0]
      }

      for(var i = 0; i < routes.length; i++){
        var replaced = false;

        if(routes[i].location.label === route.location.label){
          replaced = true;
          routes[i] = route;
          break;
        }
      }

      if(!replaced){
        routes.push(route);
      }

      updateDisplay();
    }
  });
}

function updateDisplay(){
  console.log('update display');
  console.log(routes);
  chrome.tabs.query({}, function(tabs) {
    for (var i=0; i< tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, {name: 'updateRoutes', data: routes});
    }
  });
}

function addEventListeners(){

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name === 'saveLocation') {
      
      var location = request.data;
      locations.push(location);

      chrome.storage.sync.set({'locations': locations}, function(data) {
        sendResponse();
        calculateAllRoutes();
      });

      return true;
    }

    else if(request.name === 'deleteLocation'){

      for(var i = locations.length -1; i >= 0; i--){
        if(locations[i].label === request.data.label){
          locations.splice(i, 1);
        }
      }

      chrome.storage.sync.set({'locations': locations}, function(data) {
        sendResponse();
        calculateAllRoutes();
      }); 

      return true;
    }

    else if(request.name === 'getRoutes' ){
      sendResponse({data: routes});
    }
  });


  chrome.tabs.onActivated.addListener(function(){
    setTimeout(calculateAllRoutes,0);
  })
}

var goTime = function(){
  calculateAllRoutes();
  setTimeout(goTime, 5000);
}

addEventListeners();
goTime();



