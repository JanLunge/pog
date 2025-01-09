import * as fs from 'fs-extra'
import { currentKeyboard } from './store'
import { dialog } from 'electron'
import { connectedKeyboardPort, connectSerialKeyboard, serialBoards } from './index'
import * as serialPort from 'serialport'

// invoked from frontend to select a drive or folder load the conig from
export const handleSelectDrive = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  if (canceled) return
  return await loadKeyboard(filePaths[0])
}
const loadKeyboard = async (path) => {
  if (!fs.existsSync(`${path}`)) {
    return { error: 'pathNotFound' }
  }
  const folderContents = await fs.promises.readdir(`${path}`)
  // check for kmk, code.py and boot.py
  currentKeyboard.path = path
  let codeContents: string | undefined = undefined
  if (folderContents.includes('code.py')) {
    codeContents = await fs.promises.readFile(`${currentKeyboard.path}/code.py`, {
      encoding: 'utf8',
      flag: 'r'
    })
  }
  let configContents = undefined
  if (folderContents.includes('pog.json')) {
    configContents = JSON.parse(
      await fs.promises.readFile(`${currentKeyboard.path}/pog.json`, {
        encoding: 'utf8',
        flag: 'r'
      })
    )
  }
  console.log('found something', folderContents)
  return {
    path,
    folderContents,
    codeContents,
    configContents
  }
}
export const selectKeyboard = async ({ path, id }: { path: string; id: string }) => {
  console.log('Selecting keyboard:', path, id)
  if (id) {
    // connect serial if available
    const port = serialBoards.value.find((a) => a.id === id)
    if (!port) return { error: 'not a serial keyboard' }
    console.log('Found serial board:', serialBoards, id)

    // Find both ports for this keyboard
    const allPorts = await serialPort.SerialPort.list()
    const keyboardPorts = allPorts
      .filter(p => p.serialNumber === port.serialNumber)
      .sort((a, b) => a.path.localeCompare(b.path))

    if (keyboardPorts.length >= 2) {
      currentKeyboard.serialPortA = keyboardPorts[0].path
      currentKeyboard.serialPortB = keyboardPorts[1].path
      currentKeyboard.serialNumber = port.serialNumber
      console.log('Set keyboard ports:', currentKeyboard.serialPortA, currentKeyboard.serialPortB)
    }

    await connectSerialKeyboard(port)
    connectedKeyboardPort.write('info\n')
  }
  if (path) {
    console.log('checking keyboard files for', path)
    return await loadKeyboard(path)
  } else if (id) {
    console.log('connecting serial keyboard')
    return { success: true }
  }
  return { error: 'not all args provided' }
}

export const checkForUSBKeyboards = async (keyboardPaths: string[]) => {
  console.log('checking for usb keyboards', keyboardPaths)
  // check for each path in the filesystem if it exists
  const connectedKeyboards: { path: string; connected: boolean }[] = []
  for (const path of keyboardPaths) {
    if (fs.existsSync(path)) {
      connectedKeyboards.push({
        path,
        connected: true
      })
    }
  }
  return connectedKeyboards
}
