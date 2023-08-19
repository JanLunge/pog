import * as fs from 'fs-extra'
import { currentKeyboard } from './store'
import { pogpy } from './pythontemplates/pog'
import { coordmaphelperpy } from './pythontemplates/coordmaphelper'
import { customkeyspy } from './pythontemplates/customkeys'
import { kbpy } from './pythontemplates/kb'
import { codepy } from './pythontemplates/code'
import { bootpy } from './pythontemplates/boot'
import { pog_serialpy } from './pythontemplates/pog_serial'
import {
  connectedKeyboardPort,
  pogconfigbuffer,
  writeKeymapViaSerial,
  writePogConfViaSerial
} from './index'
// save code.py based on pog.json

export const saveConfiguration = (data: string) => {
  const { pogConfig, serial, overwriteFiles } = JSON.parse(data)
  if (serial) {
    // write by serial to current keyboard
    console.log('writing firmware vio usb serial')
    writePogConfViaSerial(JSON.stringify(pogConfig, null, 4))
  } else {
    // write pog.json
    console.log('writing firmware via usb files')
    fs.writeFile(currentKeyboard.path + '/pog.json', JSON.stringify(pogConfig, null, 4), () => {
      console.log('pog File written successfully\n')
    })

    saveKeyboardConfig(pogConfig) // initialize files if they don't exist
    handleKeymapSave({ pogConfig, serial: false })
  }
}
export const saveKeyboardConfig = (pogConfig) => {
  // TODO: remove at some point from reference
  // this is now all moved to the pog.json file

  // const coordmapstring = () => {
  //   if (pogConfig.coordMap.length === 0) return ''
  //   let str = '    coord_mapping = [\n'
  //   pogConfig.coordMap.forEach((row) => {
  //     str += '    ' + row.join(',') + ',\n'
  //   })
  //   str += '    ]'
  //   return str.replaceAll(/spc,/gi, '    ')
  // }

  // write kb.py for basic config
  // let pinSetup = ``
  // const renderPin = (pin) => {
  //   if (pogConfig.pinPefix === 'board') return `board.${pin}`
  //   if (pogConfig.pinPefix === 'gp') return `board.GP${pin}`
  //   if (pogConfig.pinPefix === 'quickpin') return `pins[${pin}]`
  //   return pin
  // }
  //   if (pogConfig.wiringMethod === 'matrix') {
  //     pinSetup = `
  //     col_pins = (${pogConfig.colPins.map((a) => renderPin(a)).join(', ')})
  //     row_pins = (${pogConfig.rowPins.map((a) => renderPin(a)).join(', ')})
  //     diode_orientation = DiodeOrientation.${pogConfig.diodeDirection}
  // ${coordmapstring()}
  // `
  //   } else {
  //   pinSetup = `
  //   def __init__(self):
  //       # create and register the scanner
  //       self.matrix = KeysScanner(
  //           # require argument:
  //           pins=[${pogConfig.directPins.map((a) => 'board.GP' + a).join(', ')}],
  //           # optional arguments with defaults:
  //           value_when_pressed=False,
  //           pull=True,
  //           interval=0.02,  # Debounce time in floating point seconds
  //           max_events=64
  //       )
  //   `
  // }
  // const quickpinSupport =
  //   pogConfig.pinPrefix === 'quickpin'
  //     ? `from kmk.quickpin.pro_micro.nice_nano import pinout as pins `
  //     : ''
  //   const kbConfig = `# KB base config
  // import board
  // from kmk.kmk_keyboard import KMKKeyboard as _KMKKeyboard
  // from kmk.scanners import DiodeOrientation
  // from kmk.scanners.keypad import KeysScanner
  //
  // class KMKKeyboard(_KMKKeyboard):
  //     ${pinSetup}
  //  `
  //   console.log(quickpinSupport)

  // add option to overwrite files eg. force flash
  // add pog helper and keyboard setup

  if (!fs.existsSync(currentKeyboard.path + '/kb.py')) {
    fs.writeFile(currentKeyboard.path + '/kb.py', kbpy, () => {
      console.log('kb File written successfully')
    })
  }
  // save pog helper

  if (!fs.existsSync(currentKeyboard.path + '/pog.py')) {
    fs.writeFile(currentKeyboard.path + '/pog.py', pogpy, () => {
      console.log('pogpy File written successfully')
    })
  }

  if (!fs.existsSync(currentKeyboard.path + '/code.py')) {
    fs.writeFile(currentKeyboard.path + '/code.py', codepy, () => {
      console.log('Firmware File written successfully')
    })
  }
  if (!fs.existsSync(currentKeyboard.path + '/coordmaphelper.py')) {
    fs.writeFile(currentKeyboard.path + '/coordmaphelper.py', coordmaphelperpy, () => {
      console.log('coord map helper File written successfully')
    })
  }
  if (!fs.existsSync(currentKeyboard.path + '/customkeys.py')) {
    fs.writeFile(currentKeyboard.path + '/customkeys.py', customkeyspy, () => {
      console.log('customkeys File created successfully')
    })
  }
  if (!fs.existsSync(currentKeyboard.path + '/boot.py')) {
    fs.writeFile(currentKeyboard.path + '/boot.py', bootpy, () => {
      console.log('bootpy File created successfully')
    })
  }
  if (!fs.existsSync(currentKeyboard.path + '/pog_serial.py')) {
    fs.writeFile(currentKeyboard.path + '/pog_serial.py', pog_serialpy, () => {
      console.log('pog serial File created successfully')
    })
  }
}

// is now handled with a flag in pog.json
// export const saveCoordMapHelper = () => {
//   fs.writeFile(currentKeyboard.path + '/coordmaphelper.py', coordmaphelperpy, () => {
//     console.log('coord map helper File created successfully')
//   })
// }

export const handleKeymapSave = ({ pogConfig, serial }) => {
  // const codeblockraw = fs.readFileSync(`${keyboardPath}/code.py`, {encoding:'utf8', flag:'r'})
  // console.log(codeblockraw)
  // const codeblock = codeblockraw.match(/# CodeBlock([\S\s]*)# \/CodeBlock/gm)[1]
  // console.log(codeblock)
  // create basic keymap file
  // grab old codeblocks

  // testing encoder enable
  if (pogConfig.encoders && pogConfig.encoders.length !== 0) {
    // pythonImports +=
    //   '\nfrom kmk.modules.layers import Layers\n' +
    //   'from kmk.modules.encoder import EncoderHandler\n'
    // kmkAddons +=
    //   '\nlayers = Layers()\n' +
    //   'encoder_handler = EncoderHandler()\n' +
    //   'keyboard.modules = [layers, encoder_handler]\n'

    // still keeping the option to save the encoder keymap as raw code instead of the lookup
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
  }

  //   codeblock +=
  //     '# Encoder\n' +
  //     'encoder_handler.pins = (\n' +
  //     encoderPins +
  //     '\n' +
  //     ')\n' +
  //     'encoder_handler.map = [ \n' +
  //     encoderKeymap + // layers
  //     ']\n'
  // }
  //   const mainConfig = `# Main Keyboard Configuration
  // print("Starting ${pogConfig.name || 'Keyboard'}")
  //
  // import board
  // from kb import KMKKeyboard
  // from kmk.modules.tapdance import TapDance
  // ${pythonImports}
  //
  // keyboard = KMKKeyboard()
  // ${kmkAddons}
  //
  // tapdance = TapDance()
  // tapdance.tap_time = 200
  // keyboard.modules.append(tapdance)
  //
  // # Keymap
  // from keymap import keymap
  // keyboard.keymap = keymap
  //
  // ${codeblock}
  //
  // if __name__ == '__main__':
  //     keyboard.go()
  // `

  // we are still writing the keymap file by hand
  const keymap = `# Keymap Autogenerated by Pog do not edit
from kmk.keys import KC
from kmk.handlers.sequences import send_string, simple_key_sequence
from kmk.modules.combos import Chord, Sequence

import pog
import customkeys

keymap = [
    ${pogConfig.keymap.map((layer) => '[' + layer.join(', ') + ']').join(', ')}
]

encoderKeymap = []
for l, layer in enumerate(pog.config['encoderKeymap']):
    layerEncoders = []
    for e, encoder in enumerate(layer):
        layerEncoders.append(tuple(map(eval, encoder)))
    encoderKeymap.append(tuple(layerEncoders))
`
  if (serial) {
    writeKeymapViaSerial(keymap)
  } else {
    fs.writeFile(currentKeyboard.path + '/keymap.py', keymap, () => {
      console.log('keymap File written successfully')
    })
  }
}
