import { ref } from 'vue'
import VueStore from '@wlard/vue-class-store'
import { ulid } from 'ulid'

// @ts-ignore will be used later
type KeyActions = {
  type: 'chord' | 'tap' | 'short_hold' | 'hold' | 'sequence'
  keycodes: string[]
  actions: KeyActions[]
}[]

// list of key indexes that are selected
export const selectedKeys = ref<Set<number>>(new Set())

// currently selected keymap layer
export const selectedLayer = ref(0)

type EncoderLayer = EncoderActions[]
type EncoderActions = [string, string]
type KeyInfo = {
  x: number
  y: number
  x2?: number
  y2?: number
  matrix?: [number, number]
  w?: number
  h?: number
  h2?: number
  w2?: number
  r?: number
  rx?: number
  ry?: number
  variant?: [number, number]
}

class Key {
  id = ulid()
  x = 0
  x2?: number = undefined
  y = 0
  y2?: number = undefined
  w = 1
  w2?: number = undefined
  h = 1
  h2?: number = undefined
  r = 0
  rx = 0
  ry = 0
  matrix?: [number, number] = undefined
  variant?: [number, number] = undefined
  constructor({ x, y, matrix, variant, h, w, x2, y2, h2, w2, r, rx, ry }: KeyInfo) {
    this.x = x
    this.y = y
    if (matrix && matrix.length === 2) {
      this.matrix = matrix
    }
    if (variant && variant.length === 2) {
      this.variant = variant
    }
    if (h) this.h = h
    if (w) this.w = w
    if (h2) this.h2 = h2
    if (w2) this.w2 = w2
    if (x2) this.x2 = x2
    if (y2) this.y2 = y2
    if (r) this.r = r
    if (rx) this.rx = rx
    if (ry) this.ry = ry
  }
  serialize() {
    const tmpKey: KeyInfo = {
      x: this.x,
      y: this.y
    }
    if (this.w !== 1) {
      tmpKey.w = this.w
    }
    if (this.h !== 1) {
      tmpKey.h = this.h
    }
    if (Array.isArray(this.matrix) && this.matrix.length === 2) {
      tmpKey.matrix = this.matrix
    }
    if (Array.isArray(this.variant) && this.variant.length === 2) {
      tmpKey.matrix = this.variant
    }
    return tmpKey
  }
}
const layouts = [
  {
    name: 'Bottom Row',
    options: ['Split', 'Reverse Split', '6.25U'],
    selectedOption: 1
  }
]

class Keyboard {
  path?: string = ''
  name = ''
  manufacturer = ''
  driveContents: string[] = []

  pogConfigured = false
  firmwareInstalled = false

  // layout
  keys: Key[] = []
  // Layout options
  layouts: { name: string; variants: string[]; selected: number }[] = []

  // wiring

  controller?: string = undefined
  diodeDirection: 'ROW2COL' | 'COL2ROW' = 'COL2ROW'
  wiringMethod: 'matrix' | 'direct' = 'matrix'
  rows = 1
  cols = 1
  pins = 1
  rowPins: string[] = []
  colPins: string[] = []
  directPins: string[] = []

  // features

  encoders?: { pad_a: string; pad_b: string }[]

  // keymaps

  // layer > encoder index > encoder action index > keycode
  encoderKeymap?: EncoderLayer[] = undefined
  keymap?: (string | undefined)[][] = undefined

  constructor({ path }: { path: string }) {
    this.path = path
  }

  // Keys
  setKeys(keys: KeyInfo[]) {
    this.keys = []
    keys.forEach((key) => {
      const tmpKey = new Key(key)
      this.keys.push(tmpKey)
    })
  }
  getKeys() {
    return this.keys.map((key) => key.serialize())
  }

  hasFile(filename) {
    return this.driveContents.includes(filename)
  }

  import({
    path,
    configContents,
    codeContents,
    folderContents
  }: {
    path: string
    codeContents: string
    configContents: any
    folderContents: string[]
  }) {
    this.path = path
    this.driveContents = folderContents

    this.pogConfigured = this.hasFile('pog.json')
    this.firmwareInstalled = this.hasFile('kmk')
    if (this.pogConfigured) {
      console.log('pog.json exists, importing keyboard features')
      this.setKeys(configContents.keys)
      if (configContents.name) this.name = configContents.name
      if (configContents.manufacturer) this.manufacturer = configContents.manufacturer
      if (configContents.wiringMethod) {
        this.wiringMethod = configContents.wiringMethod

        if (configContents.rows) this.rows = configContents.rows
        if (configContents.cols) this.cols = configContents.cols
        if (configContents.pins) this.pins = configContents.pins
        if (configContents.wiringMethod === 'matrix') {
          if (configContents.rowPins) this.rowPins = configContents.rowPins
          if (configContents.colPins) this.colPins = configContents.colPins
          if (configContents.diodeDirection) this.diodeDirection = configContents.diodeDirection
        } else if (configContents.wiringMethod === 'direct') {
          if (configContents.directPins) this.directPins = configContents.directPins
        }
      }
      if (configContents.controller) this.controller = configContents.controller
      if (configContents.keymap) this.keymap = configContents.keymap
      if (configContents.layouts) this.layouts = configContents.layouts

      // encoders
      if (configContents.encoders) this.encoders = configContents.encoders
      if (configContents.encoderKeymap) this.encoderKeymap = configContents.encoderKeymap
    }
  }

  clear() {
    this.pogConfigured = false
    this.path = ''
  }

  serialize() {
    return {
      name: this.name
    }
  }
}

@VueStore
class KeyboardStore extends Keyboard {}

export const keyboardStore = new KeyboardStore({ path: undefined })

// [0,2,3] index of array is the selected layout and the value its option
export const selectedVariants = ref<number[]>([])
export const layoutVariants = ref<(string | string[])[]>([])
