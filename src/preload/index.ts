import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
export const API = {
  selectDrive: () => ipcRenderer.invoke('selectDrive'),
  updateFirmware: () => ipcRenderer.invoke('updateFirmware'),
  saveConfiguration: (data) => ipcRenderer.send('saveConfiguration', data),
  selectKeyboard: (data) => ipcRenderer.invoke('selectKeyboard', data),
  onUpdateFirmwareInstallProgress: (callback) =>
    ipcRenderer.on('onUpdateFirmwareInstallProgress', callback)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', API)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = API
}
