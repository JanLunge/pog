<template>
  <div>
      <div class="flex items-center gap-4 mb-2">
        <label>RGB Pin</label>
        <input
          type="text"
          class="input input-bordered input-sm"
          v-model="rgbPin"
          placeholder="board.GP3"
        />
      </div>
      <div class="flex items-center gap-4">
        <label>RGB Number of LEDS</label>
        <input
          type="text"
          class="input input-bordered input-sm"
          v-model="rgbNumLeds"
          placeholder="14"
        />
      </div>
  </div>
</template>

<script lang="ts" setup>
import {keyboardStore} from "../store";
import {onMounted, ref} from "vue";

const rgbPin = ref('')
const rgbNumLeds = ref('')

onMounted(() => {
  rgbPin.value = keyboardStore.rgbPin
  rgbNumLeds.value = String(keyboardStore.rgbNumLeds)
})

</script>

<style lang="scss" scoped></style>
