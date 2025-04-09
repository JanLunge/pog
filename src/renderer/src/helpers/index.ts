import JSON5 from 'json5'
import { keyboardStore, KeyInfo, selectedKeys } from '../store'
export const matrixPositionToIndex = ({
  pos,
  matrixWidth
}: {
  pos: [number, number]
  matrixWidth: number
}) => {
  if (!pos) return 0
  return Number(pos[0]) * matrixWidth + Number(pos[1])
}

const formatMatrixFromLabel = (label: string): [number, number] | false => {
  const matrix = label.split(',').map((a) => Number(a))
  if (matrix.length !== 2) return false
  return [matrix[0], matrix[1]]
}

export const cleanupKeymap = () => {
  const filledKeymap = keyboardStore.keymap.map((layer) => {
    // replace empty keys with KC.TRNS
    const tmpLayer = layer.map((key: string | undefined) => {
      if (!key) return 'KC.TRNS'
      return key
    })

    const matrixKeyCount = keyboardStore.physicalKeyCount()
    if (matrixKeyCount > tmpLayer.length) {
      while (matrixKeyCount > tmpLayer.length) {
        tmpLayer.push('KC.TRNS')
      }
    } else if (matrixKeyCount < tmpLayer.length) {
      while (matrixKeyCount < tmpLayer.length) {
        tmpLayer.pop()
      }
    }
    if (tmpLayer) return tmpLayer
    return []
  })
  if (filledKeymap) keyboardStore.keymap = filledKeymap
  console.log('fixed & set new keymap to ', filledKeymap)
}

const pickKeyAttributes = ({
  w,
  w2,
  h,
  h2,
  x,
  x2,
  y2
}: {
  w: number
  w2: number
  h: number
  h2: number
  x: number
  x2: number
  y?: number
  y2: number
}) => ({
  w,
  w2,
  h,
  h2,
  x,
  x2,
  // y,
  y2
})

// convert a kle keymap to pog
export const KleToPog = (kleString: string) => {
  let keymap = []
  try {
    keymap = JSON5.parse(kleString)
  } catch (e) {
    console.log(e)
    try {
      keymap = JSON5.parse('[' + kleString + ']')
    } catch (e) {
      console.log(e)
    }
  }

  // parse Layout file
  const configContents: {
    layouts: { keymap: string[][]; labels: string[] | string[][] }
  } = {
    layouts: { keymap, labels: [] }
  }
  // const keyboardInfo = ref<{
  //   keys: KeyData[]
  // }>({ keys: [] })

  // in place update kle to pog layout => iterate over rows
  let currentX = 0
  let currentY = 0
  let keydata: any = undefined // data to carry over to the next key until it is overwritten
  let firstKeyInRow = true
  const keys: KeyInfo[] = []
  configContents.layouts.keymap.forEach((row) => {
    if (Array.isArray(row)) {
      // normal row
      row.forEach((keyOrData) => {
        // tmp key info
        let key: KeyInfo = { x: NaN, y: NaN }
        if (typeof keyOrData === 'string') {
          // this is a key
          const labels = keyOrData.split('\n')
          if (labels.length === 1) {
            // just the main label
            // labels = ["", "", "", "", "", "", "", "", "", keyOrData];
            // key.matrixPos = keyOrData;
            const matrix = formatMatrixFromLabel(keyOrData)
            if (matrix !== false) key.matrix = matrix
          } else if (labels.length === 4) {
            // shortened labels top left and bottom right
            // labels = [keyOrData];
            // key.matrixPos = labels[0];
            const matrix = formatMatrixFromLabel(labels[0])
            if (matrix !== false) key.matrix = matrix
            key.variant = labels[3].split(',').map((a) => Number(a)) as [number, number]
          } else {
            // all labels just keep split
            // key.matrixPos = keyOrData[0];
            const matrix = formatMatrixFromLabel(keyOrData[0])
            if (matrix !== false) key.matrix = matrix
            // key.variant = keyOrData[3]
          }
          // key.labels = labels;
          // Position data
          if (keydata) {
            key = { ...key, ...pickKeyAttributes(keydata) }
            if (keydata.y) currentY += keydata.y
            if (keydata.x) currentX = keydata.x + currentX
            if (firstKeyInRow) {
              key.x = currentX
              firstKeyInRow = false
            } else {
              key.x = currentX
            }
          }
          if (!key.y) key.y = currentY
          if (!key.x) key.x = currentX
          keydata = undefined
          if (!key.w || key.w === 1) {
            currentX++
          } else {
            currentX = currentX + key.w
          }
          keys.push(key)
        } else {
          // this is just data for the next key
          keydata = keyOrData
        }
        // add 1 to left distance // next key
      })
      // add 1 to top distance // next row
      currentX = 0
      firstKeyInRow = true
      currentY++
    }
  })
  console.log('created layout', keys)
  return keys
}

export const selectNextKey = () => {
  selectedKeys.value = new Set([
    Math.min([...selectedKeys.value][0] + 1, keyboardStore.keyCount() - 1)
  ])
}
export const selectPrevKey = () => {
  selectedKeys.value = new Set([Math.max([...selectedKeys.value][0] - 1, 0)])
}

export const renderLabel = (keycode: string) => {
  const keyLabels: {
    [key: string]: { label?: string; alt?: string; icon?: string; iconWindows?: string }
  } = {
    // Define labels for your keycodes here
    F1: { label: 'F1' },
    F2: { label: 'F2' },
    F3: { label: 'F3' },
    F4: { label: 'F4' },
    F5: { label: 'F5' },
    F6: { label: 'F6' },
    F7: { label: 'F7' },
    F8: { label: 'F8' },
    F9: { label: 'F9' },
    F10: { label: 'F10' },
    F11: { label: 'F11' },
    F12: { label: 'F12' },
    A: { label: 'A' },
    B: { label: 'B' },
    C: { label: 'C' },
    D: { label: 'D' },
    E: { label: 'E' },
    F: { label: 'F' },
    G: { label: 'G' },
    H: { label: 'H' },
    I: { label: 'I' },
    J: { label: 'J' },
    K: { label: 'K' },
    L: { label: 'L' },
    M: { label: 'M' },
    N: { label: 'N' },
    O: { label: 'O' },
    P: { label: 'P' },
    Q: { label: 'Q' },
    R: { label: 'R' },
    S: { label: 'S' },
    T: { label: 'T' },
    U: { label: 'U' },
    V: { label: 'V' },
    W: { label: 'W' },
    X: { label: 'X' },
    Y: { label: 'Y' },
    Z: { label: 'Z' },
    N1: { label: '1' },
    N2: { label: '2' },
    N3: { label: '3' },
    N4: { label: '4' },
    N5: { label: '5' },
    N6: { label: '6' },
    N7: { label: '7' },
    N8: { label: '8' },
    N9: { label: '9' },
    N0: { label: '0' },
    ESC: { icon: 'mdi-keyboard-esc' },
    ENT: { icon: 'mdi-keyboard-return' },
    SPC: { icon: 'mdi-keyboard-space' },
    DOT: { label: '.' },
    COMM: { label: ',' },
    SLSH: { label: '/' },
    KP_SLASH: { label: '/' },
    SCLN: { label: ';' },
    QUOT: { label: "'" },
    LSFT: { icon: 'mdi-apple-keyboard-shift' },
    RSFT: { icon: 'mdi-apple-keyboard-shift' },
    LBRC: { label: '[' },
    RBRC: { label: ']' },
    LABK: { label: '<' },
    RABK: { label: '>' },
    LCBR: { label: '{' },
    RCBR: { label: '}' },
    LEFT_PAREN: { label: '(' },
    RIGHT_PAREN: { label: ')' },
    DQT: { label: '"' },
    COLN: { label: ':' },
    EXLM: { label: '!' },
    PERCENT: { label: '%' },
    AMPERSAND: { label: '&' },
    TILDE: { label: '~' },
    PIPE: { label: '|' },
    DOLLAR: { label: '$' },
    HASH: { label: '#' },
    QUES: { label: '?' },
    BSLS: { label: '\\' },
    MINS: { label: '-' },
    EQL: { label: '=' },
    CAPS: { icon: 'mdi-apple-keyboard-caps' },
    TAB: { icon: 'mdi-keyboard-tab' },
    BSPC: { icon: 'mdi-backspace' },
    DEL: { icon: 'mdi-backspace-reverse' },
    LCTL: { icon: 'mdi-apple-keyboard-control' },
    RCTL: { icon: 'mdi-apple-keyboard-control' },
    LALT: { icon: 'mdi-apple-keyboard-option' },
    RALT: { icon: 'mdi-apple-keyboard-option' },
    LGUI: { icon: 'mdi-apple-keyboard-command' },
    RGUI: { icon: 'mdi-apple-keyboard-command' },
    HOME: { icon: 'mdi-arrow-top-left' },
    END: { icon: 'mdi-arrow-bottom-right' },
    PGDOWN: { icon: 'mdi-arrow-down' },
    PGUP: { icon: 'mdi-arrow-up' },
    UP: { icon: 'mdi-arrow-up-thin' },
    LEFT: { icon: 'mdi-arrow-left-thin' },
    DOWN: { icon: 'mdi-arrow-down-thin' },
    RIGHT: { icon: 'mdi-arrow-right-thin' },
    GRV: { label: '`' },
    PLUS: { label: '+' },
    AT: { label: '@' },
    UNDERSCORE: { label: '_' },
    CIRCUMFLEX: { label: '^' },
    ASTERISK: { label: '*' },

    // Layer
    MO: { label: 'MO' },
    MT: { label: 'MT' },
    LT: { label: 'LT' },
    TT: { label: 'TT' },
    TG: { label: 'TG' },
    TO: { label: 'TO' },
    TD: { label: 'TD' },

    HT: { label: 'HT' },
    OS: { label: 'OS' },

    // Media
    MPLY: { label: 'Play/Pause', icon: 'mdi-play-pause' },
    VOLU: { label: 'Vol up', icon: 'mdi-volume-plus' },
    VOLD: { label: 'Vol down', icon: 'mdi-volume-minus' },
    MEDIA_PLAY_PAUSE: { label: 'Play/Pause', icon: 'mdi-play-pause' },
    MRWD: { label: 'Prev Track', icon: 'mdi-skip-previous' },
    MFFD: { label: 'Next Track', icon: 'mdi-skip-next' },
    send_string: { label: 'String' },
    RESET: { label: 'Reset' },
    RELOAD: { label: 'Reload' },
    DEBUG: { label: 'Debug' },
    RGB_TOG: { label: 'Toggle<br/>RGB' },
    RGB_HUI: { label: 'RGB<br/>Hue +' },
    RGB_HUD: { label: 'RGB<br/>Hue -' },
    RGB_SAI: { label: 'RGB<br/>Sat +' },
    RGB_SAD: { label: 'RGB<br/>Sat -' },
    RGB_VAI: { label: 'RGB<br/>Val +' },
    RGB_VAD: { label: 'RGB<br/>Val -' },
    RGB_ANI: { label: 'RGB<br/>Animation +' },
    RGB_AND: { label: 'RGB<br/>Animation -' },
    RGB_MODE_SWIRL: { label: 'RGB<br/>Swirl' },
    RGB_MODE_PLAIN: { label: 'RGB<br/>Plain' },
    RGB_MODE_KNIGHT: { label: 'RGB<br/>Knight' },
    RGB_MODE_RAINBOW: { label: 'RGB<br/>Rainbow' }
  }

  const keylabel: {
    simple: boolean
    action: string
    main: string
    lower: string
    params: any[]
    layer: number | null
    layerNamePosition: string
  } = {
    simple: true,
    action: '',
    params: [],
    layer: null,
    main: '',
    lower: '',
    layerNamePosition: ''
  }

  // Check if the keycode is a sequence
  if (keycode.startsWith('macro(') && keycode.endsWith(')')) {
    // Remove the sequence function wrapper and split the keys
    const keys = keycode.slice(5, -1).split(',')

    // Get the label for each key and join them with a "+"
    keylabel.action = keys.map((k) => renderLabel(k.trim())).join(' + ')
  } else if (keycode.startsWith('send_string(') && keycode.endsWith(')')) {
    keylabel.action = '<p class="keylabel-small">String</p>'
  } else if (keycode.startsWith('customkeys.')) {
    keylabel.action = 'custom'
    keylabel.simple = false
    const customcode = keycode.substring(11)
    keylabel.main = `${customcode}`
  } else {
    // Check for modifier keys
    // if (keycode.includes('KC.LSHIFT') || keycode.includes('KC.RSHIFT') ||
    //   keycode.includes('KC.LCTL') || keycode.includes('KC.RCTL') ||
    //   keycode.includes('KC.LALT') || keycode.includes('KC.RALT')) {
    //   label += '^ ';
    // }

    // Check for key presses
    const keyMatch = keycode.match(/KC\.(\w+)/)
    if (keyMatch) {
      const key = keyMatch[1]
      const foundKey = keyLabels[key]
      if (!foundKey) {
        keylabel.action = keycode
      } else if (foundKey.icon) {
        keylabel.action = `<i class="mdi ${foundKey.icon}"></i>`
      } else if (foundKey.label) {
        keylabel.action += foundKey.label
      }
      // if it has arguments render them as keycode as well
      if (keycode.includes('(')) {
        const match = keycode.match(/^[^(]+\((.*)\)$/)
        // dont render options for some keys eg. MT
        if (match && match[1]) {
          const params = match[1].split(',').map((a) => renderLabel(a))
          let maxParams = 10
          if (['LT', 'MT'].includes(key)) {
            // keycodes that have a label at the top
            maxParams = 2
          }
          switch (key) {
            case 'LT':
              keylabel.main = String(params[1].action)
              keylabel.lower = params[0].action
              keylabel.layer = Number(params[0].action)
              keylabel.simple = false
              keylabel.layerNamePosition = 'lower'
              break
            case 'OS':
              keylabel.main = String(params[0].action)
              keylabel.simple = false
              break
            case 'TD':
              keylabel.main = String(params.map((a) => a.action).join(' '))
              keylabel.simple = false
              break
            case 'MT':
              keylabel.main = String(params[0].action)
              keylabel.lower = String(params[1].action)
              keylabel.simple = false
              break
            case 'HT':
              keylabel.main = String(params[0].action)
              keylabel.lower = String(params[1].action)
              keylabel.simple = false
              break
            case 'TT':
              keylabel.main = String(params[0].action)
              keylabel.layer = Number(params[0].action)
              keylabel.simple = false
              break
            case 'TO':
              keylabel.main = String(params[0].action)
              keylabel.layer = Number(params[0].action)
              keylabel.simple = false
              break
            case 'TG':
              keylabel.main = String(params[0].action)
              keylabel.layer = Number(params[0].action)
              keylabel.simple = false
              break
            case 'MO':
              keylabel.main = String(params[0].action)
              keylabel.layer = Number(params[0].action)
              keylabel.simple = false
              keylabel.layerNamePosition = 'main'
              break
          }
          keylabel.params = params.slice(0, maxParams)
        }
      }
    } else {
      // custom keycodes
      keylabel.action = keycode
    }
  }

  return keylabel
}
const controllers = {
  '0xcb_helios': ['GP29']
}

export const microcontrollerPinValid = ({
  controller,
  pin
}: {
  controller: string
  pin: string
}) => {
  // check if the controller has this pin
  return controllers[controller].includes(pin)
}
