import { computed, ref } from 'vue'
import VueStore from '@wlard/vue-class-store'
import { ulid } from 'ulid'
import { useRouter } from 'vue-router'
import { matrixPositionToIndex } from '../helpers'
import { useStorage } from '@vueuse/core'
const router = useRouter()
// @ts-ignore will be used later
type KeyActions = {
  type: 'chord' | 'tap' | 'short_hold' | 'hold' | 'sequence'
  keycodes: string[]
  actions: KeyActions[]
}[]

export const keyboardHistory = useStorage<any[]>('keyboardHistory', [])

// list of key indexes that are selected
export const selectedKeys = ref<Set<number>>(new Set())

// currently selected keymap layer
export const selectedLayer = ref(0)

type EncoderLayer = EncoderActions[]
type EncoderActions = [string, string]

export type BaseKeyInfo = {
  x: number
  y: number
  x2?: number
  y2?: number
  w?: number
  h?: number
  h2?: number
  w2?: number
  r?: number
  rx?: number
  ry?: number
}
export type KeyInfo = BaseKeyInfo & {
  matrix?: [number, number]
  variant?: [number, number]
}

export class Key {
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
    if (this.w2) {
      tmpKey.w2 = this.w2
    }
    if (this.h2) {
      tmpKey.h2 = this.h2
    }
    if (this.r) {
      tmpKey.r = this.r
    }
    if (this.ry) {
      tmpKey.ry = this.ry
    }
    if (this.rx) {
      tmpKey.rx = this.rx
    }
    if (Array.isArray(this.matrix) && this.matrix.length === 2) {
      tmpKey.matrix = this.matrix.map((n) => Number(n)) as [number, number]
    }
    if (Array.isArray(this.variant) && this.variant.length === 2) {
      tmpKey.variant = this.variant.map((n) => Number(n)) as [number, number]
    }
    return tmpKey
  }
  set({}) {}
  // happity hoppety property
  delta({ property, value }: { value: number; property: keyof BaseKeyInfo }) {
    console.log('writing delta', property, value, this[property])
    if (this[property]) {
      // validate eg not less than 0 on w and h
      if (['w', 'h'].includes(property)) {
        if (this[property]! + value < 0.25) {
          return
        }
      }
      // @ts-ignore only using correct keys from type
      this[property] = this[property] + value
    } else {
      this[property] = value
    }
  }
  setOnKeymap(keyCode) {
    if (!this.matrix) return
    const keyIndex = matrixPositionToIndex({
      pos: this.matrix,
      matrixWidth: keyboardStore.cols
    })

    console.log('setting ', this.matrix, 'to', keyCode, 'at')
    if (!keyCode.includes('(')) {
      // TODO: could set this as arg in a key
      // if (
      //   currentKeyAction &&
      //   currentKeyAction.includes("(") &&
      //   selectedKey.value.args
      // ) {
      //   // Validate for what args this function takes
      //   // only set this as arg
      //   // TODO: handle multiple args
      //   let action = currentKeyAction.split("(")[0].replace(")", "");
      //   keymap.value[selectedLayer.value][keyIndex] =
      //     action + "(" + keyCode + ")";
      //   return;
      // }
    }
    keyboardStore.keymap[selectedLayer.value][keyIndex] = keyCode
  }
  getMatrixLabel() {
    if (this.matrix) {
      if (
        typeof this.matrix[0] === 'number' &&
        !isNaN(this.matrix[0]) &&
        typeof this.matrix[1] === 'number' &&
        !isNaN(this.matrix[1])
      )
        return `${this.matrix[0]} - ${this.matrix[1]}`
      if (typeof this.matrix[0] === 'number' && !isNaN(this.matrix[0]))
        return `${this.matrix[0]} - X`
      if (typeof this.matrix[1] === 'number' && !isNaN(this.matrix[1]))
        return `X - ${this.matrix[1]}`
    }
    return ''
  }
}

class Keyboard {
  id = ulid()
  path?: string = undefined
  name = ''
  manufacturer = ''
  tags: string[] = []
  description = ''

  driveContents: string[] = []

  pogConfigured = false
  firmwareInstalled = false

  // layout
  keys: Key[] = []
  // Layout options
  layouts: { name: string; variants: string[]; selected: number }[] = []

  // wiring

  controller = ''
  diodeDirection: 'ROW2COL' | 'COL2ROW' = 'COL2ROW'
  wiringMethod: 'matrix' | 'direct' = 'matrix'
  rows = 1
  cols = 1
  pins = 1
  rowPins: string[] = []
  colPins: string[] = []
  directPins: string[] = []

  // features

  encoders: { pad_a: string; pad_b: string }[] = []

  // keymaps

  // layer > encoder index > encoder action index > keycode
  encoderKeymap: EncoderLayer[] = []
  keymap: (string | undefined)[][] = [[]]

  constructor() {}

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

  addKey(key) {
    this.keys.push(new Key(key))
  }

  removeKeys({ ids }: { ids: string[] }) {
    this.keys = this.keys.filter((a) => !ids.includes(a.id))
  }
  deltaForKeys({
    keyIndexes,
    property,
    value
  }: {
    keyIndexes: number[]
    property: keyof BaseKeyInfo
    value: number
  }) {
    keyIndexes.forEach((keyIndex) => {
      this.keys[keyIndex].delta({ property, value })
    })
  }

  hasFile(filename) {
    return this.driveContents.includes(filename)
  }

  // count keys on the matrix
  physicalKeyCount() {
    if (this.wiringMethod === 'matrix') return this.rows * this.cols
    return this.pins
  }

  // count keys in the layout (including variant keys so duplicate physical keys)
  keyCount() {
    return this.keys.length
  }

  import({
    path,
    configContents,
    folderContents
  }: {
    path: string
    codeContents: string
    configContents: any
    folderContents: string[]
  }) {
    this.id = ulid()
    this.path = path
    this.driveContents = folderContents

    this.pogConfigured = this.hasFile('pog.json')
    this.firmwareInstalled = this.hasFile('kmk')
    if (this.pogConfigured) {
      console.log('pog.json exists, importing keyboard features')
      this.setKeys(configContents.keys)

      if (configContents.id) this.id = configContents.id
      if (configContents.name) this.name = configContents.name
      if (configContents.description) this.description = configContents.description
      if (configContents.tags) this.tags = configContents.tags
      if (configContents.manufacturer) this.manufacturer = configContents.manufacturer
      this.wiringMethod = configContents.wiringMethod || 'matrix'

      if (configContents.rows) this.rows = configContents.rows
      if (configContents.cols) this.cols = configContents.cols
      if (configContents.pins) this.pins = configContents.pins
      if (configContents.rowPins) this.rowPins = configContents.rowPins
      if (configContents.colPins) this.colPins = configContents.colPins
      if (configContents.diodeDirection) this.diodeDirection = configContents.diodeDirection
      if (configContents.directPins) this.directPins = configContents.directPins
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
      name: this.name,
      manufacturer: this.manufacturer,
      description: this.description,
      tags: this.tags,

      wiringMethod: this.wiringMethod,
      diodeDirection: this.diodeDirection,
      rows: this.rows,
      cols: this.cols,
      pins: this.pins,

      rowPins: this.rowPins,
      colPins: this.colPins,
      directPins: this.directPins,

      encoders: this.encoders,

      layouts: this.layouts,
      keys: this.getKeys(),

      keymap: this.keymap,
      encoderKeymap: this.encoderKeymap
    }
  }
}

@VueStore
class KeyboardStore extends Keyboard {}

export const keyboardStore = new KeyboardStore()

// [0,2,3] index of array is the selected layout and the value its option
export const selectedVariants = ref<number[]>([])
export const layoutVariants = ref<(string | string[])[]>([])

export const isNewKeyboardSetup = computed(() => {
  if (router) return router.currentRoute.value.path.startsWith('/setup-wizard')
  return false
})
