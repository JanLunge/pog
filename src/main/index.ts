import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import drivelist from 'drivelist'
import { flashFirmware } from './kmkUpdater'
// import './saveConfig'
import { checkForUSBKeyboards, handleSelectDrive, selectKeyboard } from './selectKeyboard'
import { updateFirmware } from './kmkUpdater'
import './keyboardDetector' // Import keyboard detector
import serialPort from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import fs from 'fs'
import { currentKeyboard } from './store'
import { saveConfiguration } from './saveConfig'
let mainWindow: BrowserWindow | null = null
export { mainWindow }

const isMac = process.platform === 'darwin'

let triedToQuit = false
const template: unknown = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            // {
            //   label: 'Check for Updates...',
            //   click: () => {
            //     autoUpdater.checkForUpdates()
            //   }
            // },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' }
          ]
        }
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: 'File',
    submenu: [isMac ? { role: 'close' } : { role: 'quit' }]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac
        ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
              label: 'Speech',
              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }]
            }
          ]
        : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac
        ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
        : [{ role: 'close' }])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://electronjs.org')
        }
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(template as Electron.MenuItem[])
Menu.setApplicationMenu(menu)

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: true,
      experimentalFeatures: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('de.janlunge.pog')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('before-quit', (event) => {
  // Prevent the default behavior of this event
  if (debugPort !== undefined && !triedToQuit) {
    event.preventDefault()
    triedToQuit = true
    console.log('Preparing to quit...')
    debugPort.close(() => {
      console.log('Port closed')
      debugPort = undefined

      // Instead of app.quit(), directly exit the process
      process.exit(0)
    })
  } else if (!triedToQuit) {
    // Now allow the app to continue quitting
    process.exit(0)
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

// select keyboard
// update KMK
// save keymap

ipcMain.handle('selectDrive', () => handleSelectDrive())
ipcMain.handle('deselectKeyboard', () => deselectKeyboard())
ipcMain.handle('rescanKeyboards', () => scanForKeyboards())
ipcMain.handle('updateFirmware', () => updateFirmware())
ipcMain.on('saveConfiguration', (_event, data) => saveConfiguration(data))
ipcMain.handle('checkForUSBKeyboards', (_event, data) => checkForUSBKeyboards(data))
ipcMain.handle('selectKeyboard', (_event, data) => selectKeyboard(data))
ipcMain.handle('serialPorts', (_event, data) => checkSerialDevices())
ipcMain.on('serialSend', (_event, data) => sendSerial(data))
ipcMain.handle('serialConnect', (_event, data) => serialConnect(data))
ipcMain.handle('openExternal', (_event, data) => openExternal(data))

// autoUpdater.on('update-available', () => {
//   if (mainWindow) mainWindow.webContents.send('update_available')
// })
// autoUpdater.on('update-downloaded', () => {
//   if (mainWindow) mainWindow.webContents.send('update_downloaded')
// })

const baudRate = 9600
const startTime = new Date()
let currentChunk = 0
let sendMode = ''
export let pogconfigbuffer = ''
export let keymapbuffer = ''
let total_chunks = 0
const chunksize = 1200

const getBoardInfo = (port) => {
  return new Promise((res, rej) => {
    // connect to port and get the response just once
    const sport = new serialPort.SerialPort({ path: port.path, baudRate, autoOpen: true }, (e) => {
      // if the connection fails reject the promise
      if (e) return rej(e)
    })

    const sparser = sport.pipe(new ReadlineParser({ delimiter: '\n' }))
    sparser.once('data', (data) => {
      sport.close()
      return res({ ...port, ...JSON.parse(data) })
    })
    // request the info
    sport.write('info_simple\n')
  })
}

// timer helper function
const timeout = (prom, time) => {
  let timer
  return Promise.race([prom, new Promise((_r, rej) => (timer = setTimeout(rej, time)))]).finally(
    () => clearTimeout(timer)
  )
}

export const serialBoards: { value: any[] } = { value: [] }
// TODO: resolve callbacks properly
// https://stackoverflow.com/questions/69608234/get-promise-resolve-from-separate-callback
const scanForKeyboards = async () => {
  console.log('checking for connected keyboards via serial')
  if (connectedKeyboardPort && connectedKeyboardPort.isOpen) connectedKeyboardPort.close()
  const ports = await serialPort.SerialPort.list()
  console.log('found the following raw ports:', ports)
  const circuitPythonPorts = ports.filter((port) => {
    // TODO: make sure the port is used for a pog keyboard
    // we dont want to send serial data to a REPL that is not a keyboard with pog firmware
    const manufacturer = port.manufacturer ? port.manufacturer.toLowerCase() : ''
    // if the manufactuer is pog or has pog as suffix or prefix with the - we assume its a pog keyboard
    return (
      manufacturer.endsWith('-pog') || manufacturer.startsWith('pog-') || manufacturer === 'pog'
    )
  })
  const boards = (await Promise.allSettled(
    circuitPythonPorts.map(async (a) => await timeout(getBoardInfo(a), 2000))
  )) as {
    status: 'fulfilled' | 'rejected'
    value: { name: string; id: string; path: string }
  }[]
  const filteredBoards: { name: string; id: string; path: string }[] = boards
    .filter((a) => a.value !== undefined)
    .map((a) => a.value)

  console.log('found the following boards:', filteredBoards)
  filteredBoards.map((a) => console.log(`${a.name} - ${a.id} | ${a.path}`))
  mainWindow?.webContents.send('keyboardScan', {
    keyboards: filteredBoards
  })
  serialBoards.value = filteredBoards
  return filteredBoards
}

let currentPackage = ''
let addedChunks = 0

function crossSum(s: string) {
  // Compute the cross sum
  let total = 0
  for (let i = 0; i < s.length; i++) {
    const c = s.charAt(i)
    total += c.charCodeAt(0)
  }

  return total
}

const sendConfigChunk = (port) => {
  port.write(
    JSON.stringify({
      current_chunk: currentChunk,
      total_chunks,
      data: pogconfigbuffer.substring(
        chunksize * currentChunk,
        chunksize * currentChunk + chunksize
      )
    }) + '\n'
  )
  console.log('done sending next config chunk waiting for microcontroller')
}
const sendKeymapChunk = (port) => {
  port.write(
    JSON.stringify({
      current_chunk: currentChunk,
      total_chunks,
      data: keymapbuffer.substring(chunksize * currentChunk, chunksize * currentChunk + chunksize)
    }) + '\n'
  )
  console.log('done sending next keymap chunk waiting for microcontroller')
}
export let connectedKeyboardPort: any = null

export const connectSerialKeyboard = async (keyboard) => {
  connectedKeyboardPort = new serialPort.SerialPort(
    { path: keyboard.path, baudRate, autoOpen: true },
    (e) => {}
  )
  const parser = connectedKeyboardPort.pipe(new ReadlineParser({ delimiter: '\n' }))
  // parser.once('data', (data) => {
  //   sport.close()
  //   res({ ...port, ...JSON.parse(data) })
  // })
  // port.write('info_simple\n');
  parser.on('data', (data) => {
    try {
      const chunk = JSON.parse(data.toString())
      if (chunk.type === 'pogconfig') {
        console.log('got chunk', chunk.current_chunk, 'of', chunk.total_chunks)
        const checksum = crossSum(chunk.data)
        console.log(
          'checking cross sum',
          checksum,
          chunk.cross_sum,
          checksum === chunk.cross_sum ? 'valid' : 'invalid'
        )
        // if(Math.random() > 0.8){
        //     console.error('fake invalid')
        //     port.write('0\n')
        //     return
        // }
        currentPackage += chunk.data
        addedChunks++

        if (chunk.current_chunk === Math.ceil(chunk.total_chunks)) {
          const validated = Math.ceil(chunk.total_chunks) === addedChunks
          console.log('done', addedChunks, chunk.current_chunk, validated)
          addedChunks = 0
          connectedKeyboardPort.write('y\n')
          const pogconfig = JSON.parse(currentPackage)
          // info was successfully queried push to frontend
          mainWindow?.webContents.send('serialKeyboardPogConfig', {
            pogconfig
          })
          currentPackage = ''
          return
        }
        connectedKeyboardPort.write('1\n')
        return
      } else {
        console.log('keyboard info', chunk)
      }
    } catch (e) {
      // console.log('not a proper json command, moving to simple commands', e, data, data.toString())
    }

    // pinging for next chunk
    if (data === '1') {
      if (sendMode === 'saveConfig') {
        total_chunks = Math.ceil(pogconfigbuffer.length / chunksize)
        console.log(
          'got signal that last chunk came in fine, sending more if we have more',
          currentChunk,
          total_chunks,
          data
        )

        if (currentChunk > total_chunks) {
          console.log('done sending')
          const dif = new Date().getTime() - startTime.getTime()
          console.log(`took ${dif / 1000}s`)
        } else {
          sendConfigChunk(connectedKeyboardPort)
          currentChunk += 1
        }
      } else if (sendMode === 'saveKeymap') {
        total_chunks = Math.ceil(keymapbuffer.length / chunksize)
        console.log(
          'last chunk came in fine, sending more if we have more',
          currentChunk,
          total_chunks,
          data
        )
        if (currentChunk <= total_chunks) {
          sendKeymapChunk(connectedKeyboardPort)
          currentChunk += 1
        }
      }
    } else if (data === 'y') {
      console.log('something else', data)
      // general reset
      sendMode = ''
      currentChunk = 0
    }
    return
  })
}
export const writePogConfViaSerial = (pogconfig) => {
  pogconfigbuffer = pogconfig
  currentChunk = 0
  sendMode = 'saveConfig'
  if (!connectedKeyboardPort) {
    console.log('port not set')
  } else if (!connectedKeyboardPort.isConnected) {
    connectedKeyboardPort.open(() => {
      console.log('port open again')
      connectedKeyboardPort.write('save\n')
    })
  } else {
    connectedKeyboardPort.write('save\n')
  }
}
export const writeKeymapViaSerial = (pogconfig) => {
  keymapbuffer = pogconfig
  currentChunk = 0
  sendMode = 'saveKeymap'
  if (!connectedKeyboardPort) {
    console.log('port not set')
  } else if (!connectedKeyboardPort.isConnected) {
    connectedKeyboardPort.open(() => {
      console.log('port open again')
      connectedKeyboardPort.write('saveKeymap\n')
    })
  } else {
    connectedKeyboardPort.write('saveKeymap\n')
  }
}
const deselectKeyboard = () => {
  if (connectedKeyboardPort && connectedKeyboardPort.isConnected) {
    connectedKeyboardPort.close()
  }
}

let debugPort: any = undefined
const CONNECTION_TIMEOUT = 5000 // 5 seconds timeout

const notifyConnectionStatus = (connected: boolean, error?: string) => {
  mainWindow?.webContents.send('serialConnectionStatus', { connected, error })
}

const closeDebugPort = () => {
  return new Promise<void>((resolve) => {
    if (debugPort?.isOpen) {
      debugPort.close(() => {
        debugPort = undefined
        resolve()
      })
    } else {
      debugPort = undefined
      resolve()
    }
  })
}

const serialConnect = async (port) => {
  console.log('connecting to serial port', port)

  try {
    // First ensure any existing connection is properly closed
    await closeDebugPort()

    // Create a promise that will reject after timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), CONNECTION_TIMEOUT)
    })

    // Create the connection promise
    const connectionPromise = new Promise((resolve, reject) => {
      try {
        debugPort = new serialPort.SerialPort({ path: port, baudRate, autoOpen: true }, (err) => {
          if (err) {
            reject(err)
            return
          }

          const parser = debugPort.pipe(new ReadlineParser({ delimiter: '\n' }))

          parser.on('data', (data) => {
            console.log('got data from serial', data)
            mainWindow?.webContents.send('serialData', { message: data + '\n' })
          })

          debugPort.on('error', (error) => {
            console.error('Serial port error:', error)
            notifyConnectionStatus(false, error.message)
            closeDebugPort()
          })

          debugPort.on('close', () => {
            console.log('Serial port closed')
            notifyConnectionStatus(false)
          })

          resolve(true)
        })
      } catch (err) {
        reject(err)
      }
    })

    // Wait for either connection or timeout
    await Promise.race([connectionPromise, timeoutPromise])

    console.log('Successfully connected to serial port')
    notifyConnectionStatus(true)
  } catch (error: any) {
    console.error('Failed to connect:', error)
    await closeDebugPort()
    notifyConnectionStatus(false, error instanceof Error ? error.message : 'Unknown error')
    throw error
  }
}

const sendSerial = (message) => {
  if (!debugPort?.isOpen) {
    console.error('Cannot send: port not open')
    return
  }

  console.log('sending serial', message)
  mainWindow?.webContents.send('serialData', { message: `> sent: ${message}\n` })

  try {
    let buffer
    if (message === 'ctrlc') {
      buffer = Buffer.from('\x03\x03', 'utf8')
    } else if (message === 'ctrld') {
      buffer = Buffer.from('\x04', 'utf8')
    } else {
      buffer = Buffer.from(message + '\r\n', 'utf8')
    }

    debugPort.write(buffer, (err) => {
      if (err) {
        console.error('error sending serial', err)
        notifyConnectionStatus(false, 'Failed to send data')
      }
    })
  } catch (error) {
    console.error('Error sending serial data:', error)
    notifyConnectionStatus(false, 'Failed to send data')
  }
}

// Add new IPC handler for disconnect
ipcMain.handle('serialDisconnect', async () => {
  await closeDebugPort()
})

const checkSerialDevices = async () => {
  try {
    console.log('checking serial devices')
    const ports = await serialPort.SerialPort.list()

    if (ports.length === 0) {
      console.log('No serial ports found')
      return []
    }

    const returnPorts = ports.map((port) => {
      return {
        port: port.path,
        manufacturer: port.manufacturer,
        serialNumber: port.serialNumber
        // Add more attributes here if needed
      }
    })
    console.log('found serial ports', returnPorts)
    return returnPorts
  } catch (error) {
    console.error('Error fetching the list of serial ports:', error)
    return []
  }
}

const openExternal = (url) => {
  shell.openExternal(url)
}

// Drive and Firmware handlers
ipcMain.handle('list-drives', async () => {
  try {
    const drives = await drivelist.list()
    const filteredDrives = drives
      .map((drive) => ({
        path: drive.mountpoints[0]?.path || '',
        name: drive.mountpoints[0]?.label || drive.description || 'Unknown Drive',
        isReadOnly: drive.isReadOnly,
        isRemovable: drive.isRemovable,
        isSystem: drive.isSystem,
        isUSB: drive.isUSB,
        isCard: drive.isCard
      }))
      .filter((drive) => drive.path !== '' && drive.isUSB)
    console.log('drives', filteredDrives)
    return filteredDrives
  } catch (error) {
    console.error('Failed to list drives:', error)
    throw error
  }
})

ipcMain.handle(
  'flash-detection-firmware',
  async (_event, { drivePath, serialNumber }: { drivePath: string; serialNumber: string }) => {
    try {
      // Set the current keyboard path
      currentKeyboard.path = drivePath
      currentKeyboard.name = 'New Keyboard'
      currentKeyboard.id = Date.now().toString()
      currentKeyboard.serialNumber = serialNumber
      console.log('flashing detection firmware currentKeyboard', currentKeyboard)

      // Create necessary directories if they don't exist
      if (!fs.existsSync(drivePath)) {
        throw new Error(`Drive path ${drivePath} does not exist`)
      }

      // Flash the detection firmware
      await flashFirmware(drivePath)

      // setup both ports to listen for detection
      return { success: true }
    } catch (error) {
      console.error('Failed to flash firmware:', error)
      throw error
    }
  }
)

// Keyboard History handlers
ipcMain.handle('list-keyboards', () => {
  try {
    return listKeyboards()
  } catch (error) {
    console.error('Failed to list keyboards:', error)
    throw error
  }
})

// Serial Port handlers
ipcMain.handle('serial-ports', async () => {
  try {
    console.log('checking serial devices')
    const ports = await serialPort.SerialPort.list()

    if (ports.length === 0) {
      console.log('No serial ports found')
      return []
    }

    const returnPorts = ports.map((port) => ({
      port: port.path,
      manufacturer: port.manufacturer,
      serialNumber: port.serialNumber
    }))
    console.log('found serial ports', returnPorts)
    return returnPorts
  } catch (error) {
    console.error('Error fetching the list of serial ports:', error)
    return []
  }
})

ipcMain.handle('serial-connect', async (_event, port: string) => {
  return serialConnect(port)
})

ipcMain.handle('serial-disconnect', async () => {
  return closeDebugPort()
})
