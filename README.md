![logo](demo/pog-header.png?raw=true)
<h1 align="center">POG</h1>
<h4 align="center">
KMK GUI, Layout Editor, Keymap Editor, Flashing Utility
</h4>
<p align="center">
    <a href="https://github.com/JanLunge/pog/stargazers"><img src="https://img.shields.io/github/stars/JanLunge/pog" alt="Stars Badge"/></a>
    <a href="https://github.com/JanLunge/pog/network/members"><img src="https://img.shields.io/github/forks/JanLunge/pog" alt="Forks Badge"/></a>
    <img src="https://badgen.net/badge/version/v1.4.4" alt="">
</p>

![preview](demo/pog-screenshot.png?raw=true)

# Documentation
the documentation is available [here](https://github.com/JanLunge/pog-docs). Feel free to contribute

# Installation
download the pre-built binaries for Windows, Mac and Linux are available in the [releases](https://github.com/JanLunge/pog/releases)

# Development Setup
## dependencies
* node 16
* yarn

install everything with
`yarn`
then just run it with dev to start
`yarn dev`

to release a new version use `npm version minor` or `major` or `patch` then just push and github actions will do the rest

# Tasks
## bugs
- [ ] maximum call stack error when closing the app
## urgent
- [x] check if a keyboard is connected (usb drive) in the keyboard selector preview
- [x] show serial output in the gui
- [ ] automatically get the correct serial device (by serial number)
- [ ] guides etc. for setup + split workflow | help menu + videos
- [ ] save wiring info in qr code or so
- [ ] share pog.json files
- [ ] check if the controller you use even has the pin you specified (controller lookup and serial to get pins )
- [ ] generate layout based on matrix + clear layout button / delete multiple
- [ ] features case-insensitive and via gui or pog json

## features wishlist
- [ ] bluetooth workflow
- [ ] language switcher for german and other layouts changing the labels on the keymap
- [ ] modtap/tapdance/macros/sequences
- [ ] encoder support direct pin click
- [ ] way to handle differences between pog.json to kmk code
- [ ] wiring preview


### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
