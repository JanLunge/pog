// Store for global variables
import { app } from 'electron'

export const appDir = app.getPath('appData') + '/pog/'

interface Keyboard {
  path: string
  name: string
  id: string
  usingSerial?: boolean
  serialPortA?: string
  serialPortB?: string
  serialNumber?: string
}

export const currentKeyboard: Keyboard = {
  path: '',
  name: '',
  id: '',
  usingSerial: false,
  serialPortA: '',
  serialPortB: '',
  serialNumber: ''
}
