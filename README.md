# pog
keyboard flashing utility

POG stands for Pog Open Gui

![version](https://badgen.net/badge/version/v0.5.0/green )

![logo](build/icon.png?raw=true)

![preview](resources/pog-thumbnail.png?raw=true)

## dependencies
* node 16
* yarn

## Setup
install everything with
`yarn`
then just run it with dev to start
`yarn dev`


# Tasks
## urgent
- [ ] guides etc for setup + split workflow
- [ ] share pog.json files
- [ ] check if the controller you use even has the pin you specified (controller lookup and serial to get pins )
- [ ] bluetooth workflow
- [ ] generate layout based on matrix + clear layout button / delete multiple

## features
- [ ] language switcher for german and other layouts changing the labels on the keymap
- [ ] modtap/tapdance/macros/sequences
- [ ] encoder support direct pin click
- [ ] way to handle differences between pog.json to kmk code
- [ ] wiring preview

## done
- [x] boot.py generation
- [x] versioning for python files
- [x] direct pin wiring support
- [x] save a backup of the json in electron
- [x] dragging keys on the layout editor
- [x] Layout editor to replace KLE
- [x] save pog.json (use as main storage for everything)
- [x] adjust keymap when matrix changes
- [x] drag and drop keys

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
