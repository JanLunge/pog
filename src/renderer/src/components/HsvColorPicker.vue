<template>
  <div class="mb-2 flex items-center gap-4">
    <div class="flex flex-col gap-2">
      <h2 class="font-bold">Color & Brightness</h2>
      <div class="grid grid-cols-2 gap-4">
        <div class="grid grid-cols-2 gap-2">
          <label>Hue:</label>
          <input
            v-model="hsvColor.hue"
            class="input input-bordered input-sm"
            type="number"
            max="255"
            min="0"
            @input="onInput"
          />
          <label>Saturation:</label>
          <input
            v-model="hsvColor.sat"
            class="input input-bordered input-sm"
            type="number"
            max="255"
            min="0"
            @input="onInput"
          />
          <label>Brightness:</label>
          <input
            v-model="hsvColor.val"
            class="input input-bordered input-sm"
            type="number"
            max="255"
            min="0"
            @input="onInput"
          />
        </div>
        <input
          v-model="rgbColor"
          type="color"
          class="input input-sm row-span-1 h-full w-full"
          placeholder="14"
          @change="onColorPicker"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, Ref, ref } from 'vue'
import { keyboardStore } from '../store'
import { hexToHSL, hslToHex } from '../helpers/colors'

const emit = defineEmits(['change'])

const rgbColor = ref('')
const hsvColor: Ref<{ hue: number; sat: number; val: number }> = ref({ hue: 0, sat: 0, val: 0 })

onMounted(() => {
  if (!keyboardStore.rgbOptions) return

  hsvColor.value.hue = keyboardStore.rgbOptions.hueDefault
  hsvColor.value.sat = keyboardStore.rgbOptions.satDefault
  hsvColor.value.val = keyboardStore.rgbOptions.valDefault

  rgbColor.value = hslToHex(hsvColor.value.hue, hsvColor.value.sat, hsvColor.value.val)
})

const onInput = () => {
  rgbColor.value = hslToHex(hsvColor.value.hue, hsvColor.value.sat, hsvColor.value.val)
  emit('change', hsvColor.value)
}

const onColorPicker = () => {
  hsvColor.value = hexToHSL(rgbColor.value)
  emit('change', hsvColor.value)
}
</script>
