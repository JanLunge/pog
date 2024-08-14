<template>
  <div class="mb-2 flex items-center gap-4">
    <label>Colour</label>
    <h1>Hue {{ hsvColor.hue }}</h1>
    <h1>sat {{ hsvColor.sat }}</h1>
    <h1>val {{ hsvColor.val }}</h1>
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
import { onMounted, Ref, ref } from 'vue'
import { keyboardStore } from '../store'
import { hexToHSL, hslToHex } from '@renderer/helpers/colors'

const emit = defineEmits(['change'])

const rgbColor = ref('')
const hsvColor: Ref<{ hue: number; sat: number; val: number }> = ref({ hue: 0, sat: 0, val: 0 })

onMounted(() => {
  hsvColor.value.hue = keyboardStore.rgb.hueDefault
  hsvColor.value.sat = keyboardStore.rgb.satDefault
  hsvColor.value.val = keyboardStore.rgb.valDefault

  rgbColor.value = hslToHex(hsvColor.value.hue, hsvColor.value.sat, hsvColor.value.val )
})

const saveColor = () => {
  hsvColor.value = hexToHSL(rgbColor.value)
  emit('change', hsvColor.value)
}
</script>
