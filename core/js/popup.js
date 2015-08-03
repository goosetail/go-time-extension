var addressInput = document.getElementById('address-input');
var nameInput = document.getElementById('name-input');
var autocomplete = new google.maps.places.Autocomplete(addressInput);
var newLocation = document.getElementById('new-location');
var savedLocations = document.getElementById('saved-locations');
var locationsList = document.getElementById('locations-list');
var newLocationLink = document.getElementById('new-location-link');
var cancelNewLocationLink = document.getElementById('cancel-new-location-link');
var directionsService = new google.maps.DirectionsService();
var routes = [];
var locations = [];

function attachEventListeners() {
  newLocationLink.addEventListener('click', showNewLocation);
  cancelNewLocationLink.addEventListener('click', hideNewLocation);

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();

    if(!place.geometry){
      alert('We couldn\'t find that location. :(');
      return;
    }

    var location = {
      label: nameInput.value,
      name: place.name,
      coordinates: place.geometry.location,
    }

    saveLocation(location);
  });
}

function saveLocation(location){
  locations.push(location);

  chrome.storage.sync.set({'locations': locations}, function(data) {
    showSavedLocations();
    createLoadingItem('Calculating route...');
    calculateRouteForLocations([location]);
    hideNewLocation();

  });
}

function getLocations(){
   chrome.storage.sync.get('locations', function(data){
    if(data && data.locations && data.locations.length){
      showSavedLocations();
      createLoadingItem('Calculating routes...');

      locations = data.locations;
      calculateRouteForLocations(data.locations);
    }
    else{
      showNewLocation();
    }
  });
}

function createLoadingItem(text){
  var loadingItem = document.createElement('li');
  loadingItem.className = 'saved-location';
  loadingItem.id = 'location-loader';

  var loadingText = document.createTextNode(text);

  loadingItem.appendChild(loadingText);
  locationsList.appendChild(loadingItem);
}

function removeLoadingItem(){
  var loadingId = 'location-loader';
  var loadingItem = document.getElementById(loadingId);

  if(loadingItem){
    locationsList.removeChild(loadingItem);
  }

}

function showSavedLocations(){
  savedLocations.classList.remove('hide');
}

function hideSavedLocations(){
  savedLocations.classList.add('hide');
}

function showNewLocation(){
  hideNewLocationLink();
  newLocation.classList.remove('hide');
}

function hideNewLocation(){
  resetInputs();
  showNewLocationLink();
  newLocation.classList.add('hide');
}

function showNewLocationLink(){
  newLocationLink.classList.remove('hide');
}

function hideNewLocationLink(){
  newLocationLink.classList.add('hide');
}

function resetInputs(){
  setTimeout(function(){
     nameInput.value = '';
    addressInput.value = '';
    addressInput.blur();
  }, 0)
}



function addToSavedLocations(route){
  
  var locationItem = document.createElement('li');
  locationItem.className = 'saved-location';
  locationItem.id = formatRouteId(route.location.label)

  // Route Link that shows the time
  var routeLink = document.createElement('a');
  routeLink.className = 'route-link';
  routeLink.target = '_blank';

  var startAddress = route.data.legs[0].start_address;
  var endAddress = route.data.legs[0].end_address;

  routeLink.href = 'https://maps.google.com?saddr='+startAddress+'&daddr='+endAddress;

  var duration = route.data.legs[0].duration.text + ' to ' + route.location.label;
  var durationText = document.createTextNode(duration);

  var locationLabel = document.createElement('span');
  locationLabel.className = 'location-label';
  locationLabel.appendChild(durationText);

  routeLink.appendChild(locationLabel);

  var locationName = document.createElement('span');
  var nameText = document.createTextNode(route.location.name);
  
  locationName.className = 'location-name';
  locationName.appendChild(nameText);

  routeLink.appendChild(locationName);

  var removeIcon = document.createElement('span');
  removeIcon.className = 'remove-icon';

  removeIcon.addEventListener('click', function(){
    removeLocation(route.location);
  });

  locationItem.appendChild(routeLink);
  locationItem.appendChild(removeIcon);

  locationsList.appendChild(locationItem);

}

function removeLocation(location){
  var locationId = formatRouteId(location.label);
  var locationItem = document.getElementById(locationId);
  
  for(var i = locations.length -1; i >= 0; i--){
    if(locations[i].label === location.label){
      locations.splice(i, 1);
    }
  }

  chrome.storage.sync.set({'locations': locations}, function(data) {
    locationsList.removeChild(locationItem);
  }); 

}

function formatRouteId(label){
  return label.toLowerCase().replace(/\s/g, '-') + '-route';
}

function calculateRouteForLocations(locations){

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  }

  function successFunction(position) {

    var start = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

    for(var i = 0; i < locations.length; i++){

      var end = new google.maps.LatLng(locations[i].coordinates.A, locations[i].coordinates.F);

      calculateRoute(locations[i], start, end);
    }
  }

  function errorFunction(err){
    console.log('could not determine location')
  }
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

      addToSavedLocations(route);
      removeLoadingItem();

    }
  });
}

getLocations();
attachEventListeners();

// chrome autofocuses the first link when the pop up opens and it's kind of annoying
setTimeout(function(){
  newLocationLink.blur();
}, 200)





