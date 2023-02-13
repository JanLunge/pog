import { ElectronAPI } from '@electron-toolkit/preload'
import {API} from './index'
declare global {
  interface Window {
    electron: ElectronAPI
    api: typeof API
  }
}
