import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'
import { BrowserWindow, ipcMain } from 'electron'
import { flashFirmware } from './kmkUpdater'
import path from 'path'
import fs from 'fs'
import { currentKeyboard } from './store'

interface DetectionData {
  rows: string[]
  cols: string[]
  diodeDirection: 'COL2ROW' | 'ROW2COL'
  pressedKeys: { row: number; col: number }[]
}

export class KeyboardDetector {
  private port: SerialPort | null = null
  private parser: ReadlineParser | null = null
  private detectionData: DetectionData = {
    rows: [],
    cols: [],
    diodeDirection: 'COL2ROW',
    pressedKeys: []
  }

  async startDetection(window: BrowserWindow) {
    try {
      // Flash detection firmware
    //   const detectionFirmwarePath = path.join(__dirname, '../firmware/detection')
    //   await flashFirmware(detectionFirmwarePath)

      // Wait for the board to restart
    //   await new Promise(resolve => setTimeout(resolve, 2000))

      // Find the data port (second port)
      const serialNumber = currentKeyboard.serialNumber
      console.log('Using serial number for detection:', serialNumber)

      // Find both serial ports for this serial number
      const ports = await SerialPort.list()
      const matchingPorts = ports
        .filter(port => port.serialNumber === serialNumber)
        .sort((a, b) => a.path.localeCompare(b.path))

      if (matchingPorts.length < 2) {
        throw new Error('Could not find both serial ports for keyboard')
      }

      // Save ports to current keyboard, with lower numbered port as port A
      currentKeyboard.serialPortA = matchingPorts[0].path
      currentKeyboard.serialPortB = matchingPorts[1].path

      // Use port B (higher numbered port) for detection
      const dataPort = currentKeyboard.serialPortB

      if (!dataPort) {
        throw new Error('Data port not found. Make sure both serial ports are properly connected.')
      }

      // Open serial connection
      this.port = new SerialPort({
        path: dataPort,
        baudRate: 115200
      })

      this.parser = this.port.pipe(new ReadlineParser())

      // Handle incoming data
      this.parser.on('data', (data: string) => {
        this.handleDetectionData(data, window)
      })

      // Start detection mode
      this.port.write('start_detection\n')
    } catch (error) {
      console.error('Detection failed:', error)
      throw error
    }
  }

  private handleDetectionData(data: string, window: BrowserWindow) {
    try {
      const message = JSON.parse(data)
      console.log('Received message:', message)
      switch (message.type) {
        case 'new_key_press':
          // Send update to renderer
          console.log('Sending new_key_press to renderer', message)
          window.webContents.send('detection-update', message)
          break
        case 'existing_key_press':
          // Send update to renderer
          console.log('Sending existing_key_press to renderer', message)
          window.webContents.send('detection-update', message)
          break
        case 'used_pins':
          this.detectionData.diodeDirection = message.direction
          console.log('Sending used_pins to renderer', message)
          window.webContents.send('detection-update', message)
          break
      }
    } catch (error) {
      console.error('Failed to handle detection data:', error)
    }
  }

  stopDetection() {
    if (this.port) {
      this.port.write('stop_detection\n')
      this.port.close()
      this.port = null
      this.parser = null
    }
  }

  getDetectionData(): DetectionData {
    return this.detectionData
  }
}

// Create detector instance
const detector = new KeyboardDetector()

// IPC handlers
ipcMain.handle('start-detection', async (event) => {
  const window = BrowserWindow.fromWebContents(event.sender)
  if (window) {
    await detector.startDetection(window)
    return { success: true }
  }
  throw new Error('Window not found')
})

ipcMain.handle('stop-detection', () => {
  detector.stopDetection()
  return { success: true }
})

ipcMain.handle('get-detection-data', () => {
  return detector.getDetectionData()
}) 