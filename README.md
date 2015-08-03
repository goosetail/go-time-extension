# Go Time! Chrome Extension

## Getting Started

* clone the repo: `$ git clone git@github.com:goosetail/go-time-extension.git`
* `$ cd go-time-extension`
* `$ npm install`
* Visit [chrome://extensions/](chrome://extensions/)
* Click 'Load unpacked extension'
* Upload the contents of the `core/` dir. 

## Building for Production

* `$ cd go-time-extension`
* `$ grunt`

The grunt task will copy all files in `core/` to `build/unpacked-prod`, minifying the .css files and uglifying the .js files.