import { app, shell, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import {checkForUSBKeyboards, handleSelectDrive, selectKeyboard} from './selectKeyboard'
import { updateFirmware } from './kmkUpdater'
import { handleKeymapSave, saveConfiguration } from './saveConfig'
import { autoUpdater } from 'electron-updater'
import serialPort from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import { log } from 'util'
let mainWindow: BrowserWindow | null = null
export { mainWindow }

const isMac = process.platform === 'darwin'

const template: unknown = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            {
              label: 'Check for Updates...',
              click: () => {
                autoUpdater.checkForUpdatesAndNotify()
              }
            },
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
    width: 1100,
    height: 800,
    minWidth: 700,
    minHeight: 200,
    show: false,
    // autoHideMenuBar: true,
    backgroundColor: '#000000',
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) mainWindow.show()
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
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('de.heaper.pog')

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

autoUpdater.on('update-available', () => {
  if (mainWindow) mainWindow.webContents.send('update_available')
})
autoUpdater.on('update-downloaded', () => {
  if (mainWindow) mainWindow.webContents.send('update_downloaded')
})

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
    // connect to port and get the response
    const sport = new serialPort.SerialPort(
      { path: port.path, baudRate, autoOpen: true },
      (e) => {}
    )
    const sparser = sport.pipe(new ReadlineParser({ delimiter: '\n' }))
    sparser.once('data', (data) => {
      sport.close()
      res({ ...port, ...JSON.parse(data) })
    })
    sport.write('info_simple\n')
  })
}
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
  const circuitPythonPorts = ports //.filter(port => {
  //     return port.manufacturer && ['0xCB'].includes(port.manufacturer)
  // });
  const boards = (await Promise.allSettled(
    circuitPythonPorts.map(async (a) => await timeout(getBoardInfo(a), 2000))
  )) as {
    status: 'fulfilled' | 'rejected'
    value:  { name: string; id: string; path: string }
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
function crossSum(s) {
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
      console.log('not a proper json command, moving to simple commands', e, data, data.toString())
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
          // now saving keymap
          handleKeymapSave({ pogConfig: JSON.parse(pogconfigbuffer), serial: true })
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
      // if sendmode = pog config send keymap as well
      if (sendMode === 'saveConfig') {
        handleKeymapSave({ pogConfig: JSON.parse(pogconfigbuffer), serial: true })
        return
      }
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
