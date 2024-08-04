<template>
  <div class="mb-2 flex items-center gap-4">
    <label>Colour</label>
    <h1>Hue {{ hsvColour.hue }}</h1>
    <h1>sat {{ hsvColour.sat }}</h1>
    <h1>val {{ hsvColour.val }}</h1>
    <input
      v-model="rgbColor"
      type="color"
      class="input input-bordered input-sm"
      placeholder="14"
      @change="saveColor"
    />
  </div>
</template>

<script lang="ts" setup>
import { Ref, ref } from 'vue'

const emit = defineEmits(['change'])

const rgbColor = ref('')
const hsvColour: Ref<{ hue: number; sat: number; val: number }> = ref({ hue: 0, sat: 0, val: 0 })

const saveColor = () => {
  hexToHSL(rgbColor.value)
  emit('change', hsvColour)
}

const hexToHSL = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  let r = parseInt(result[1], 16)
  let g = parseInt(result[2], 16)
  let b = parseInt(result[3], 16)

  ;(r /= 255), (g /= 255), (b /= 255)
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

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

  hsvColour.value.hue = Math.round(h * 255)
  hsvColour.value.sat = Math.round(s * 255)
  hsvColour.value.val = Math.round(l * 255)
}
</script>
