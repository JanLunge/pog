export const hexToHSL = (hex): {hue: number, sat: number, val: number} => {
  const result: RegExpExecArray | null = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return { hue: 0, sat: 0, val: 0 }
  let r = parseInt(result[1], 16)
  let g = parseInt(result[2], 16)
  let b = parseInt(result[3], 16)

  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return {
    hue: Math.round(h * 255),
    sat: Math.round(s * 255),
    val: Math.round(l * 255)
  }
}

export function hslToHex(h, s, l): string {
  h *= 360 / 255
  s /= 255
  l /= 255

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (0 <= h && h < 60) {
    r = c
    g = x
    b = 0
  } else if (60 <= h && h < 120) {
    r = x
    g = c
    b = 0
  } else if (120 <= h && h < 180) {
    r = 0
    g = c
    b = x
  } else if (180 <= h && h < 240) {
    r = 0
    g = x
    b = c
  } else if (240 <= h && h < 300) {
    r = x
    g = 0
    b = c
  } else if (300 <= h && h < 360) {
    r = c
    g = 0
    b = x
  }
  // Having obtained RGB, convert channels to hex
  let r_str = Math.round((r + m) * 255).toString(16)
  let g_str = Math.round((g + m) * 255).toString(16)
  let b_str = Math.round((b + m) * 255).toString(16)

  // Prepend 0s, if necessary
  if (r_str.length == 1) r_str = '0' + r
  if (g_str.length == 1) g_str = '0' + g
  if (b_str.length == 1) b_str = '0' + b

  return '#' + r_str + g_str + b_str
}
