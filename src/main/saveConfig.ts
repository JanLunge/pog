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
import { writePogConfViaSerial } from './index'

export const saveConfiguration = (data: string) => {
  const { pogConfig, serial, writeFirmware } = JSON.parse(data)
  if (serial) {
    // write by serial to current keyboard
    console.log('writing firmware via usb serial')
    writePogConfViaSerial(JSON.stringify(pogConfig, null, 0))
  } else {
    // write pog.json
    console.log('writing firmware via usb files', 'overwriting Firmware:', writeFirmware)
    fs.writeFile(currentKeyboard.path + '/pog.json', JSON.stringify(pogConfig, null, 4), (e) => {
      if (e) {
        console.log('error writing pog.json', e)
      } else {
        console.log('pog.json written successfully')
      }
    })

    const files = [
      { name: 'pog.py', contents: pogpy },
      { name: 'code.py', contents: codepy },
      { name: 'coordmaphelper.py', contents: coordmaphelperpy },
      { name: 'customkeys.py', contents: customkeyspy },
      { name: 'boot.py', contents: bootpy },
      { name: 'pog_serial.py', contents: pog_serialpy },
      { name: 'keymap.py', contents: keymappy },
      { name: 'kb.py', contents: kbpy }
    ]
    for (const file of files) {
      if (!fs.existsSync(currentKeyboard.path + '/' + file.name) || writeFirmware) {
        fs.writeFile(currentKeyboard.path + '/' + file.name, file.contents, () => {
          console.log(file.name + 'File written successfully')
        })
      }
    }
  }
}
