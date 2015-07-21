var directionsService = new google.maps.DirectionsService();
var route = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name === 'saveRoute') {
      chrome.storage.sync.set({'route': {start: request.data.start, end: request.data.end}}, function() {
        calculateRoute();
      });
    }

    if(request.name === 'getRoute' ){
      sendResponse(route);
    }
});

function calculateRoute(){
  console.log('calculating route');

  chrome.storage.sync.get('route', function(data){
    console.log('route data', data);

    if(data){
      var start = new google.maps.LatLng(data.route.start.A, data.route.start.F);
      var end = new google.maps.LatLng(data.route.end.A, data.route.end.F);

      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };

      directionsService.route(request, function(result, status) {
        if(result && result.routes.length) {

          route = {
            duration: result.routes[0].legs[0].duration,
            summary: result.routes[0].summary
          }

          updateDuration();
        }

      });
    }
  })
}

function updateDuration(duration, summary){
  chrome.tabs.query({}, function(tabs) {
    for (var i=0; i<tabs.length; ++i) {
      chrome.tabs.sendMessage(tabs[i].id, {name: 'updateDuration', data: route});
    }
  });
}

var goTime = function(){
  console.log('go');
  calculateRoute();
  setTimeout(goTime, 300000);
}

goTime();



