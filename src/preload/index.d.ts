import { ElectronAPI } from '@electron-toolkit/preload'
import { API } from './index'

export interface IElectronAPI {
  // Keyboard History API
  listKeyboards: () => Promise<Array<{
    id: string
    name: string
    path: string
    usingSerial?: boolean
  }>>
  
  // Drive and Firmware API
  listDrives: () => Promise<Array<{
    path: string
    name: string
    isReadOnly: boolean
    isRemovable: boolean
    isSystem: boolean
    isUSB: boolean
    isCard: boolean
  }>>
  flashDetectionFirmware: ({drivePath: string, serialNumber?: string}) => Promise<{ success: boolean }>
  
  // Serial Port API
  serialPorts: () => Promise<Array<{
    port: string
    manufacturer?: string
    serialNumber?: string
  }>>
  serialConnect: (port: string) => Promise<void>
  serialDisconnect: () => Promise<void>
  serialData: (callback: (event: any, data: { message: string }) => void) => void
  serialConnectionStatus: (callback: (event: any, data: { connected: boolean, error?: string }) => void) => void
  serialSend: (message: string) => void
  
  // Keyboard Detection API
  startDetection: () => Promise<{ success: boolean }>
  stopDetection: () => Promise<{ success: boolean }>
  getDetectionData: () => Promise<{
    rows: string[]
    cols: string[]
    diodeDirection: 'COL2ROW' | 'ROW2COL'
    pressedKeys: { row: number; col: number }[]
  }>
  onDetectionUpdate: (callback: (data: any, event: any) => void) => void
  removeDetectionListeners: () => void
  onUpdateFirmwareInstallProgress: (callback: (data: any, event: any) => void) => void
  // Legacy API (to be migrated)
  selectKeyboard: (data: any) => Promise<any>
  deselectKeyboard: () => Promise<void>
  openExternal: (url: string) => Promise<void>
  selectDrive: () => Promise<any>
  updateFirmware: () => Promise<void>
  saveConfiguration: (data: any) => Promise<void>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}
