import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  selectDrive: () => ipcRenderer.invoke('selectDrive'),
  updateFirmware: () => ipcRenderer.invoke('updateFirmware'),
  saveConfiguration: (data) => ipcRenderer.send('saveConfiguration', data),
  selectKeyboard: (data) => ipcRenderer.invoke('selectKeyboard', data),
  onUpdateFirmwareInstallProgress: (callback) =>
    ipcRenderer.on('onUpdateFirmwareInstallProgress', callback),
  onSaveConfigurationProgress: (callback) =>
    ipcRenderer.on('save-configuration-progress', callback),
  offSaveConfigurationProgress: (callback) =>
    ipcRenderer.removeListener('save-configuration-progress', callback),
  keyboardScan: (callback) => {
    ipcRenderer.on('keyboardScan', callback)
  },
  serialKeyboardPogConfig: (callback) => {
    ipcRenderer.on('serialKeyboardPogConfig', callback)
  },
  rescanKeyboards: () => ipcRenderer.invoke('rescanKeyboards'),
  checkForUSBKeyboards: (data) => ipcRenderer.invoke('checkForUSBKeyboards', data),
  deselectKeyboard: () => ipcRenderer.invoke('deselectKeyboard'),
  serialData: (callback) => ipcRenderer.on('serialData', callback),
  offSerialData: (callback) => ipcRenderer.removeListener('serialData', callback),
  serialConnectionStatus: (callback) => ipcRenderer.on('serialConnectionStatus', callback),
  serialPorts: () => ipcRenderer.invoke('serial-ports'),
  serialSend: (data) => ipcRenderer.send('serialSend', data),
  serialConnect: (port: string) => ipcRenderer.invoke('serial-connect', port),
  serialDisconnect: () => ipcRenderer.invoke('serial-disconnect'),
  openExternal: (data) => ipcRenderer.invoke('openExternal', data),
  // Keyboard Detection API
  startDetection: () => ipcRenderer.invoke('start-detection'),
  stopDetection: () => ipcRenderer.invoke('stop-detection'),
  getDetectionData: () => ipcRenderer.invoke('get-detection-data'),
  onDetectionUpdate: (callback) => 
    ipcRenderer.on('detection-update', callback),
  // Keyboard History API
  listKeyboards: () => ipcRenderer.invoke('list-keyboards'),
  // Drive and Firmware API
  listDrives: () => ipcRenderer.invoke('list-drives'),
  flashDetectionFirmware: (drivePath: string) => ipcRenderer.invoke('flash-detection-firmware', drivePath)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
