import * as fs from 'fs-extra'
import { currentKeyboard } from './store'
// save code.py based on pog.json

export const saveConfiguration = (data: string) => {
  const {pogConfig, writeFirmware} = JSON.parse(data)
  // write pog.json config
  // write pog.json
  fs.writeFile(currentKeyboard.path + '/pog.json', JSON.stringify(pogConfig, null, 4), () => {
    console.log('pog File written successfully\n')
  })
  if (writeFirmware) {
    console.log('should also write firmware files')
    handleKeymapSave(pogConfig)
  }
}

export const handleKeymapSave = (pogConfig) => {
  console.log('saving keymap', pogConfig)
  // const codeblockraw = fs.readFileSync(`${keyboardPath}/code.py`, {encoding:'utf8', flag:'r'})
  // console.log(codeblockraw)
  // const codeblock = codeblockraw.match(/# CodeBlock([\S\s]*)# \/CodeBlock/gm)[1]
  // console.log(codeblock)
  // create basic keymap file
  // grab old codeblocks
  let pythonImports = ''
  let kmkAddons = ''
  let codeblock = ''
  //layers
  if (true) {
    pythonImports += '\nfrom kmk.modules.layers import Layers\n'
    kmkAddons += '\nkeyboard.modules.append(Layers())\n'
  }

  //media keys
  if (true) {
    pythonImports += '\nfrom kmk.extensions.media_keys import MediaKeys\n'
    kmkAddons += '\nkeyboard.extensions.append(MediaKeys())\n'
  }
  // testing encoder enable
  if (pogConfig.encoders && pogConfig.encoders.length !== 0) {
    pythonImports +=
      '\nfrom kmk.modules.layers import Layers\n' +
      'from kmk.modules.encoder import EncoderHandler\n'
    kmkAddons +=
      '\nlayers = Layers()\n' +
      'encoder_handler = EncoderHandler()\n' +
      'keyboard.modules = [layers, encoder_handler]\n'

    let encoderPins = ''
    pogConfig.encoders.forEach((encoder) => {
      encoderPins += `(board.GP${encoder.pad_a}, board.GP${encoder.pad_b}, None,),`
    })

    let encoderKeymap = ''
    // keymap: [layer[encoder[keys]]
    pogConfig.encoderKeymap.forEach((layer) => {
      encoderKeymap += '('
      layer.forEach((encoder) => {
        encoderKeymap += `(${encoder.join(',')},),`
      })
      encoderKeymap += '),\n'
    })

    codeblock +=
      '# Encoder\n' +
      'encoder_handler.pins = (\n' +
      encoderPins +
      '\n' +
      ')\n' +
      'encoder_handler.map = [ \n' +
      encoderKeymap + // layers
      ']\n'
  }
  const keymapString = `print("Starting")

import board
import supervisor
import digitalio
import storage
import usb_cdc
import usb_hid

from kmk.kmk_keyboard import KMKKeyboard
from kmk.keys import KC
from kmk.scanners import DiodeOrientation
${pythonImports}

keyboard = KMKKeyboard()
${kmkAddons}

# Cols
keyboard.col_pins = (${pogConfig.colPins.map((a) => 'board.GP' + a).join(', ')})
# Rows
keyboard.row_pins = (${pogConfig.rowPins.map((a) => 'board.GP' + a).join(', ')})
# Diode Direction
keyboard.diode_orientation = DiodeOrientation.${pogConfig.diodeDirection}

# Keymap
keyboard.keymap = [
    ${pogConfig.keymap.map((layer) => '[' + layer.join(', ') + ']').join(', ')}
]

${codeblock}

if __name__ == '__main__':
    keyboard.go()
`
  fs.writeFile(currentKeyboard.path + '/code.py', keymapString, () => {
    console.log('Firmware File written successfully\n')
  })
}
