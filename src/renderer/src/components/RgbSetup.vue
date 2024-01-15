<template>
  <div>
    <label class="flex gap-4">
      <input class="checkbox" type="checkbox" v-model="rgbEnabled" @change="toggleRgbEnabled">
      <p>Enable RGB</p>
    </label>
    <p class="p-4 my-4 rounded bg-base-300">info: to enable rgb you also will need a neopixel.mpy file in the lib folder on your circuit python drive. you
      can download that here:
      <a href="https://github.com/adafruit/Adafruit_CircuitPython_NeoPixel/releases">Adafruit GitHub</a></p>
    <div class="flex items-center gap-4 mb-2">
      <label>RGB Pin</label>
      <input
        type="text"
        class="input input-bordered input-sm"
        v-model="rgbPin"
        placeholder="board.GP3"
        @change="savePin"
      />
    </div>
    <div class="flex items-center gap-4">
      <label>RGB Number of LEDS</label>
      <input
        type="text"
        class="input input-bordered input-sm"
        v-model="rgbNumLeds"
        placeholder="14"
        @change="saveNumLeds"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {keyboardStore} from "../store";
import {onMounted, ref} from "vue";

const rgbPin = ref('')
const rgbNumLeds = ref('')
const rgbEnabled = ref(false)

onMounted(() => {
  rgbPin.value = keyboardStore.rgbPin
  rgbNumLeds.value = String(keyboardStore.rgbNumLeds)
  rgbEnabled.value = keyboardStore.kbFeatures.some((feature) => feature.toLowerCase() === 'rgb')
})

const savePin = () => {
  keyboardStore.rgbPin = rgbPin.value
}

const saveNumLeds = () => {
  keyboardStore.rgbNumLeds = Number(rgbNumLeds.value)
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
