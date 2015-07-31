var addressInput = document.getElementById('address-input');
var nameInput = document.getElementById('name-input');
var autocomplete = new google.maps.places.Autocomplete(addressInput);
var savedLocations = document.getElementById('saved-locations');

function attachEventListeners() {
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
   chrome.runtime.sendMessage({name: 'saveLocation', data: location}, function(response){
      addToSavedLocations(location);
   });
}

function getLocations(){
   chrome.storage.sync.get('locations', function(data){
    if(data && data.locations && data.locations.length){
      for(var i = 0; i < data.locations.length; i++){
        addToSavedLocations(data.locations[i]);
      }
    }
  });
}

function addToSavedLocations(location){

  var locationItem = document.createElement('li');
  locationItem.className = 'saved-location';
  locationItem.id = location.label + '-location';

  var locationLabel = document.createElement('label');
  locationLabel.className = 'location-label';

  var labelText = document.createTextNode(location.label);

  var locationName = document.createElement('span');
  locationName.className = 'location-name';

  var nameText = document.createTextNode(location.name);
  locationName.appendChild(nameText);

  var removeIcon = document.createElement('span');
  removeIcon.className = 'remove-icon';

  removeIcon.addEventListener('click', function(){
    removeLocation(location);
  });

  locationLabel.appendChild(labelText);
  locationLabel.appendChild(locationName);
  locationLabel.appendChild(removeIcon);

  locationItem.appendChild(locationLabel);

  savedLocations.appendChild(locationItem);

}

function removeLocation(location){

  var locationItem = document.getElementById(location.label + '-location');
  
  chrome.runtime.sendMessage({name: 'deleteLocation', data: location}, function(response){
    savedLocations.removeChild(locationItem);
 });

}

getLocations();
attachEventListeners();





