var input = document.getElementById('pac-input');
var autocomplete = new google.maps.places.Autocomplete(input);
var start;
var end;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
}

function successFunction(position) {
  start = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
}

function errorFunction(err){
  alert('We could not determine where you are.');
}

google.maps.event.addListener(autocomplete, 'place_changed', function() {
  var place = autocomplete.getPlace();

  if(!place.geometry){
    alert('We couldn\'t find that location. :(');
    return;
  }

  end = place.geometry.location;

  chrome.runtime.sendMessage({name: "saveRoute", data: {start: start, end: end}});
});





