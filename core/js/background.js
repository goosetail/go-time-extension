var directionsService = new google.maps.DirectionsService();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name == "saveRoute") {
      chrome.storage.sync.set({'route': {start: request.data.start, end: request.data.end}}, function() {
        calculateRoute();
      });
    }
});


function calculateRoute(){
  chrome.storage.sync.get('route', function(data){

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
          var duration = result.routes[0].legs[0].duration;
          var summary = result.routes[0].summary;

          updateDuration(duration, summary);
        }

      });
    }
  })
}

function updateDuration(duration, summary){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if(tabs[0] && tabs[0].id){
      chrome.tabs.sendMessage(tabs[0].id, {name: "updateDuration", data: {duration: duration, summary: summary}});
    }
  });
}

var goTime = function(){
  calculateRoute();
  setTimeout(goTime, 60000);
}

goTime();



