# WorkLife Chrome Extension

## Submitting to Google / [Developer dashboard](https://chrome.google.com/webstore/developer/dashboard)

* [Download current extension](https://github.com/heroiklabs/chrome-extension/archive/master.zip)
* Upload to [Extension page](https://chrome.google.com/webstore/developer/edit/ppjlalkkaldieompimefhhhpdfklpjnp)


## Getting Started

* clone the repo: `$ git clone git@github.com:heroiklabs/chrome-extension.git`
* `$ cd chrome-extension`
* `$ npm install`
* Visit [chrome://extensions/](chrome://extensions/)
* Click 'Load unpacked extension'
* Upload the contents of the `core/` dir. 

## Building for Production

* `$ cd chrome-extension`
* `$ grunt`

The grunt task will copy all files in `core/` to `build/unpacked-prod`, minifying the .css files and uglifying the .js files.