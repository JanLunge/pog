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
import { writePogConfViaSerial, mainWindow } from './index'

export const saveConfiguration = async (data: string) => {
  const { pogConfig, serial, writeFirmware } = JSON.parse(data)
  if (serial) {
    // write by serial to current keyboard
    console.log('writing firmware via usb serial')
    writePogConfViaSerial(JSON.stringify(pogConfig, null, 0))
    return
  }

  // write via mounted USB drive
  console.log('writing firmware via usb files', 'overwriting Firmware:', writeFirmware)

  type WriteTask = { name: string; path: string; contents: string }
  const tasks: WriteTask[] = []

  // Always write pog.json
  tasks.push({
    name: 'pog.json',
    path: currentKeyboard.path + '/pog.json',
    contents: JSON.stringify(pogConfig, null, 4)
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
    const targetPath = currentKeyboard.path + '/' + file.name
    if (!fs.existsSync(targetPath) || writeFirmware) {
      tasks.push({ name: file.name, path: targetPath, contents: file.contents })
    }
  }

  const total = tasks.length
  let completed = 0

  for (const task of tasks) {
    try {
      await fs.promises.writeFile(task.path, task.contents)
      completed += 1
      mainWindow?.webContents.send('save-configuration-progress', {
        state: 'writing',
        filename: task.name,
        completed,
        total
      })
    } catch (e) {
      console.error(`error writing ${task.name}`, e)
      mainWindow?.webContents.send('save-configuration-progress', {
        state: 'error',
        filename: task.name,
        completed,
        total
      })
    }
  }

  mainWindow?.webContents.send('save-configuration-progress', {
    state: 'done',
    completed,
    total
  })
}
