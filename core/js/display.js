//alert('content script injected');
var display = document.createElement('div')
display.id = 'go-time-display';

var duration = document.createElement('span');
duration.id = 'go-time-duration';

var loadingText = document.createTextNode('Loading...');

duration.appendChild(loadingText);

display.appendChild(duration);

document.body.appendChild(display);

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name === 'updateDuration') {
      updateDuration(request.data.duration.text);
    }
});

chrome.runtime.sendMessage({name: 'getRoute'}, function(response){
	console.log('route retrieved', response);
	if(response && response.duration){
		updateDuration(response.duration.text);
	}
});

function updateDuration(text){
	duration.innerHTML = text;
}