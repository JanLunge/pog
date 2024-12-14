import * as fs from 'fs-extra'
import { currentKeyboard } from './store'
import { pogpy } from './pythontemplates/pog'
import { coordmaphelperpy } from './pythontemplates/coordmaphelper'
import { customkeyspy } from './pythontemplates/customkeys'
import { kbpy } from './pythontemplates/kb'
import { codepy } from './pythontemplates/code'
import { bootpy } from './pythontemplates/boot'
import { pog_serialpy } from './pythontemplates/pog_serial'
import { keymappy } from './pythontemplates/keymap'
import {
  connectedKeyboardPort,
  pogconfigbuffer,
  writeKeymapViaSerial,
  writePogConfViaSerial
} from './index'
// save code.py based on pog.json

export const saveConfiguration = (data: string) => {
  const { pogConfig, serial, overwriteFiles, writeFirmware } = JSON.parse(data)
  if (serial) {
    // write by serial to current keyboard
    console.log('writing firmware via usb serial')
    writePogConfViaSerial(JSON.stringify(pogConfig, null, 0))
  } else {
    // write pog.json
    console.log('writing firmware via usb files', 'overwriting Firmware:', writeFirmware)
    fs.writeFile(currentKeyboard.path + '/pog.json', JSON.stringify(pogConfig, null, 4), () => {
      console.log('pog File written successfully\n')
    })

    saveKeyboardConfig(pogConfig, writeFirmware) // initialize files if they don't exist
  }
}

const flashFileToKB = ({ fileName, overwrite, fileContents }) => {
  if (!fs.existsSync(currentKeyboard.path + '/' + fileName) || overwrite) {
    fs.writeFile(currentKeyboard.path + '/' + fileName, fileContents, () => {
      console.log(fileName + 'File written successfully')
    })
  }
}

export const saveKeyboardConfig = (pogConfig, writeFirmware) => {
  // TODO: add option to overwrite files eg. force flash (writeFirmware)

  // add pog helper and keyboard setup
  flashFileToKB({
    fileName: 'kb.py',
    overwrite: writeFirmware,
    fileContents: kbpy
  })

  // save pog helper
  flashFileToKB({
    fileName: 'pog.py',
    overwrite: writeFirmware,
    fileContents: pogpy
  })
  flashFileToKB({
    fileName: 'code.py',
    overwrite: writeFirmware,
    fileContents: codepy
  })
  flashFileToKB({
    fileName: 'coordmaphelper.py',
    overwrite: writeFirmware,
    fileContents: coordmaphelperpy
  })
  flashFileToKB({
    fileName: 'customkeys.py',
    overwrite: writeFirmware,
    fileContents: customkeyspy
  })
  flashFileToKB({
    fileName: 'boot.py',
    overwrite: writeFirmware,
    fileContents: bootpy
  })
  flashFileToKB({
    fileName: 'pog_serial.py',
    overwrite: writeFirmware,
    fileContents: pog_serialpy
  })
  flashFileToKB({
    fileName: 'keymap.py',
    overwrite: writeFirmware,
    fileContents: keymappy
  })
}
