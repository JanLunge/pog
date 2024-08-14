<template>
  <div>
    <label class="flex gap-4">
      <input v-model="rgbEnabled" class="checkbox" type="checkbox" @change="toggleRgbEnabled" />
      <p>Enable RGB</p>
    </label>
    <p class="my-4 rounded bg-base-300 p-4">
      Info: To enable RGB you also will need a neopixel.mpy file in the lib folder on your
      CircuitPython drive eg. adafruit-circuitpython-neopixel-py-6.3.11.zip as neopixel.py . You can
      download that here:
      <a
        href="https://github.com/adafruit/Adafruit_CircuitPython_NeoPixel/releases"
        class="underline"
        target="_blank"
        >Adafruit GitHub</a
      >
    </p>

    <div class="flex mb-4">
      <div class="grid grid-cols-2 gap-2">
        <label>RGB Pin</label>
        <input
          v-model="rgbPin"
          type="text"
          class="input input-bordered input-sm"
          placeholder="board.GP3"
          @change="savePin"
        />
        <label>RGB Number of LEDS</label>
        <input
          v-model="rgbNumLeds"
          type="text"
          class="input input-bordered input-sm"
          placeholder="14"
          @change="saveNumLeds"
        />
        <label>Animation Mode</label>
        <select
          v-model="rgbAnimationMode"
          class="mb-4 select select-bordered input-sm"
          @change="saveMode"
        >
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
        <div
          v-if="rgbAnimationMode != 0 && rgbAnimationMode != 1 && rgbAnimationMode != 2"
          class="col-span-2 flex justify-between"
        >
          <label>Animation Speed</label>
          <input
            v-model="rgbAnimationSpeed"
            type="text"
            class="input input-bordered input-sm"
            placeholder="1"
            @change="saveAnimationSpeed"
          />
        </div>
        <div
          v-if="rgbAnimationMode == 3 || rgbAnimationMode == 5 || rgbAnimationMode == 8"
          class="col-span-2 flex justify-between"
        >
          <label>Breathe Center</label>
          <input
            v-model="rgbBreatheCenter"
            type="text"
            class="input input-bordered input-sm"
            placeholder="1"
            min="1"
            max="2.7"
            step="0.1"
            @change="saveBreatheCenter"
          />
        </div>
        <div
          v-if="rgbAnimationMode == 6 || rgbAnimationMode == 8"
          class="col-span-2 flex justify-between"
        >
          <label>Knight Effect Length</label>
          <input
            v-model="rgbKnightEffectLength"
            type="text"
            class="input input-bordered input-sm"
            placeholder="1"
            @change="saveKnightEffectLength"
          />
        </div>
      </div>
    </div>
    <HsvColorPicker
      v-if="
        rgbAnimationMode == 1 ||
        rgbAnimationMode == 2 ||
        rgbAnimationMode == 3 ||
        rgbAnimationMode == 6 ||
        rgbAnimationMode == 8
      "
      @change="saveColor"
    />
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from '../store'
import { onMounted, ref } from 'vue'
import HsvColorPicker from './HsvColorPicker.vue'

const rgbPin = ref('')
const rgbNumLeds = ref('')
const rgbAnimationMode = ref(0)
const rgbAnimationSpeed = ref(0)
const rgbBreatheCenter = ref(0)
const rgbKnightEffectLength = ref(0)
const rgbEnabled = ref(false)

onMounted(() => {
  rgbPin.value = keyboardStore.rgbPin
  rgbNumLeds.value = String(keyboardStore.rgbNumLeds)
  rgbAnimationMode.value = keyboardStore.rgbOptions.animationMode
  rgbAnimationSpeed.value = keyboardStore.rgbOptions.animationSpeed
  rgbBreatheCenter.value = keyboardStore.rgbOptions.breatheCenter
  rgbKnightEffectLength.value = keyboardStore.rgbOptions.knightEffectLength

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

const saveAnimationSpeed = () => {
  keyboardStore.rgbOptions.animationSpeed = Number(rgbAnimationSpeed.value)
}

const saveBreatheCenter = () => {
  keyboardStore.rgbOptions.breatheCenter = Number(rgbBreatheCenter.value)
}

const saveKnightEffectLength = () => {
  keyboardStore.rgbOptions.knightEffectLength = Number(rgbKnightEffectLength.value)
}

const saveColor = (hsvColor) => {
  keyboardStore.rgbOptions.hueDefault = hsvColor.hue
  keyboardStore.rgbOptions.satDefault = hsvColor.sat
  keyboardStore.rgbOptions.valDefault = hsvColor.val
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
