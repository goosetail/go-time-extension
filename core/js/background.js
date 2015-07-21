var directionsService = new google.maps.DirectionsService();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name == "calculateRoute") {
      calculateRoute(request.data.start, request.data.end);
    }
});

function calculateRoute(start, end){

  var request = {
    origin: new google.maps.LatLng(start.A, start.F),
    destination: new google.maps.LatLng(end.A, end.F),
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

function updateDuration(duration, summary){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {name: "updateDuration", data: {duration: duration, summary: summary}});
  });
}



