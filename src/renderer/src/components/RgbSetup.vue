<template>
  <div>
    <label class="flex gap-4">
      <input v-model="rgbEnabled" class="checkbox" type="checkbox" @change="toggleRgbEnabled" />
      <p>Enable RGB</p>
    </label>
    <p class="my-4 rounded bg-base-300 p-4">
      Info: To enable RGB you also will need a neopixel.mpy file in the lib folder on your
      CircuitPython drive eg. adafruit-circuitpython-neopixel-py-6.3.11.zip as neopixel.py . You can download that here:
      <a
        href="https://github.com/adafruit/Adafruit_CircuitPython_NeoPixel/releases"
        class="underline"
        target="_blank"
        >Adafruit GitHub</a
      >
    </p>
    <div class="mb-2 flex items-center gap-4">
      <label>RGB Pin</label>
      <input
        type="text"
        class="input input-bordered input-sm"
        v-model="rgbPin"
        placeholder="board.GP3"
        @change="savePin"
      />
    </div>
    <div class="mb-2 flex items-center gap-4">
      <label>RGB Number of LEDS</label>
      <input
        type="text"
        class="input input-bordered input-sm"
        v-model="rgbNumLeds"
        placeholder="14"
        @change="saveNumLeds"
      />
    </div>
    <div class="mb-2 flex items-center gap-4">
      <label>Animation Mode</label>
      <select v-model="rgbAnimationMode" class="select select-bordered" @change="saveMode">
        <option value="0">Off</option>
        <option value="1">Static</option>
        <option value="2">Static Standby</option>
        <option value="3">Breathing</option>
        <option value="4">Rainbow</option>
        <option value="5">Breathing Rainbow</option>
        <option value="6">Knight</option>
        <option value="7">Swirl</option>
        <option value="8">Custom</option>
      </select>
    </div>

    <HsvColorPicker @change="saveColor" />
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from '../store'
import { onMounted, ref } from 'vue'
import HsvColorPicker from './HsvColorPicker.vue'

const rgbPin = ref('')
const rgbNumLeds = ref('')
const rgbAnimationMode = ref(0)
const rgbEnabled = ref(false)

onMounted(() => {
  rgbPin.value = keyboardStore.rgbPin
  rgbNumLeds.value = String(keyboardStore.rgbNumLeds)
  rgbAnimationMode.value = keyboardStore.rgbOptions.animationMode
  rgbEnabled.value = keyboardStore.kbFeatures.some((feature) => feature.toLowerCase() === 'rgb')
})

const savePin = () => {
  keyboardStore.rgbPin = rgbPin.value
}

const saveNumLeds = () => {
  keyboardStore.rgbNumLeds = Number(rgbNumLeds.value)
}
const saveMode = () => {
  keyboardStore.rgbOptions.animationMode = Number(rgbAnimationMode.value)
}

const saveColor = (hsvColor) => {
  keyboardStore.rgb.hueDefault = hsvColor.hue
  keyboardStore.rgb.satDefault = hsvColor.sat
  keyboardStore.rgb.valDefault = hsvColor.val
}

const toggleRgbEnabled = () => {
  if (keyboardStore.kbFeatures.some((feature) => feature.toLowerCase() === 'rgb')) {
    keyboardStore.kbFeatures = keyboardStore.kbFeatures.filter(
      (feature) => feature.toLowerCase() !== 'rgb'
    )
  } else {
    keyboardStore.kbFeatures.push('rgb')
  }
}
</script>

<style lang="scss" scoped></style>
