//alert('content script injected');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name == "updateDuration") {
      console.log(request.data)
    }
});