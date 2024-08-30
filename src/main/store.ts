// Store for global variables
import { app } from 'electron'

export const appDir = app.getPath('appData') + '/pog/'
export const currentKeyboard = {
  path: ''
}
