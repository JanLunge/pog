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
  console.log('set new keymap to ', filledKeymap)
}

const pickKeyAttributes = ({
  w,
  w2,
  h,
  h2,
  x,
  x2,
  y,
  y2
}: {
  w: number
  w2: number
  h: number
  h2: number
  x: number
  x2: number
  y: number
  y2: number
}) => ({
  w,
  w2,
  h,
  h2,
  x,
  x2,
  y,
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
            if (keydata.y) currentY = keydata.y
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
    SCLN: { label: ';' },
    QUOT: { label: "'" },
    LSFT: { icon: 'mdi-apple-keyboard-shift' },
    RSFT: { icon: 'mdi-apple-keyboard-shift' },
    LBRC: { label: '[' },
    RBRC: { label: ']' },
    BSLS: { label: '\\' },
    MINS: { label: '-' },
    EQL: { label: '=' },
    CAPS: { icon: 'mdi-apple-keyboard-caps' },
    TAB: { icon: 'mdi-keyboard-tab' },
    BSPC: { icon: 'mdi-backspace' },
    LCTL: { icon: 'mdi-apple-keyboard-control' },
    RCTL: { icon: 'mdi-apple-keyboard-control' },
    LALT: { icon: 'mdi-apple-keyboard-option' },
    RALT: { icon: 'mdi-apple-keyboard-option' },
    LGUI: { icon: 'mdi-apple-keyboard-command' },
    RGUI: { icon: 'mdi-apple-keyboard-command' },
    UP: { icon: 'mdi-arrow-up' },
    LEFT: { icon: 'mdi-arrow-left' },
    DOWN: { icon: 'mdi-arrow-down' },
    RIGHT: { icon: 'mdi-arrow-right' },
    GRV: { label: '`' },

    // Layer
    MO: { label: 'MO' },

    // Media
    MPLY: { label: 'Play/Pause', icon: 'mdi-play-pause' },
    MEDIA_PLAY_PAUSE: { label: 'Play/Pause', icon: 'mdi-play-pause' },
    MRWD: { label: 'Prev Track', icon: 'mdi-skip-previous' },
    MFFD: { label: 'Next Track', icon: 'mdi-skip-next' },
    TD: { label: '<p class="keylabel-small">TD</p>' },
    send_string: { label: 'String</br>' }
  }

  let label = ''

  // Check if the keycode is a sequence
  if (keycode.startsWith('simple_key_sequence(') && keycode.endsWith(')')) {
    // Remove the sequence function wrapper and split the keys
    const keys = keycode.slice(19, -1).split(',')

    // Get the label for each key and join them with a "+"
    label = keys.map((k) => renderLabel(k.trim())).join(' + ')
  } else if (keycode.startsWith('send_string(') && keycode.endsWith(')')) {
    label = '<p class="keylabel-small">String</p>'
  } else if(keycode.startsWith('customkeys.')){
    label = '<p class="keylabel-small">custom</p>'
  }else {
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
      if (!keyLabels[key]) {
        label += keycode
      } else if (keyLabels[key].icon) {
        label += `<i class="mdi ${keyLabels[key].icon}"></i>`
      } else if (keyLabels[key].label) {
        label += keyLabels[key].label
      }
      // if it has arguments render them as keycode as well
      if (keycode.includes('(')) {
        const match = keycode.match(/^[^(]+\((.*)\)$/)
        console.log('found params', match) // prints ["0", "KC.A"]
        if (match && match[1] && match[1].includes(',')) {
          const params = match[1].split(',').map((a) => renderLabel(a))
          console.log('param list', params)
          label += ` ${params.join(' ')}`
        } else if (match) {
          // just add that key to label
          label += ` ${renderLabel(match[1])}`
        }
      }
    } else {
      // custom keycodes
      label += keycode
    }
  }

  return label
}
