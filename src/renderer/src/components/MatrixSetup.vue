<template>
  <div>
    <p class="max-w-xl py-4">
      Define the size of your keyboard matrix here, set it as big as you need. For easier wiring set
      it to the max number of cols/rows on your keyboard
    </p>
    <div class="mb-4 flex flex-col gap-2">
      <div>
        <p class="mb-2 text-sm">Keyboard Type</p>
        <select v-model="keyboardStore.keyboardType" class="select select-bordered mb-2 w-full">
          <option value="normal">Normal</option>
          <option value="splitBle">Split (Bluetooth)</option>
          <option value="splitSerial">Split (Serial)</option>
          <option value="splitOnewire">Split (1 Pin)</option>
        </select>
      </div>
      <label
        v-if="['splitSerial', 'splitOnewire'].includes(keyboardStore.keyboardType)"
        class="flex gap-2"
      >
        <input v-model="keyboardStore.splitUsePio" type="checkbox" class="checkbox" />
        <span>usePio</span>
      </label>
      <label
        v-if="['splitSerial'].includes(keyboardStore.keyboardType)"
        class="flex gap-2"
      >
        <input v-model="keyboardStore.splitUartFlip" type="checkbox" class="checkbox" />
        <span>uartFlip</span>
      </label>

      <label
        v-if="['splitSerial', 'splitOnewire', 'splitBle'].includes(keyboardStore.keyboardType)"
        class="flex gap-2"
      >
        <input v-model="keyboardStore.splitFlip" type="checkbox" class="checkbox" />
        <span>splitFlip</span>
      </label>
    </div>
    <div class="mb-4">
      <p class="mb-2 text-sm">Wiring Method</p>
      <select v-model="keyboardStore.wiringMethod" class="select select-bordered w-full">
        <option value="matrix">Matrix</option>
        <option value="direct">Direct Pins</option>
      </select>
    </div>

    <div v-if="keyboardStore.wiringMethod === 'matrix'" class="mb-8 grid grid-cols-2 gap-2">
      <InputLabel
        v-model="keyboardStore.cols"
        placeholder="1"
        input-type="number"
        label="Matrix Width"
        :min="0"
        @input="checkMatrix"
      ></InputLabel>
      <InputLabel
        v-model="keyboardStore.rows"
        placeholder="1"
        input-type="number"
        label="Matrix Height"
        :min="0"
        @input="checkMatrix"
      ></InputLabel>
    </div>
    <div v-if="keyboardStore.wiringMethod === 'direct'" class="mb-8">
      <InputLabel
        v-model="keyboardStore.pins"
        placeholder="1"
        input-type="number"
        label="Pin Count"
        :min="1"
        @input="checkMatrix"
      ></InputLabel>
    </div>
    <div v-if="initialSetup" class="mb-8 flex justify-center">
      <button
        class="btn btn-primary"
        :class="{ 'btn-disabled': matrixEmpty }"
        @click="$emit('next')"
      >
        Next
      </button>
    </div>
    <div v-if="keyboardStore.wiringMethod === 'matrix'" class="grid-visualizer">
      <div v-for="_row in keyboardStore.rows" class="row">
        <div v-for="_col in keyboardStore.cols" class="col"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import InputLabel from './ui/InputLabel.vue'
import { keyboardStore } from '../store'
import { computed } from 'vue'

defineProps(['initialSetup'])
const matrixEmpty = computed(() => {
  return !(
    keyboardStore.cols !== 0 &&
    keyboardStore.rows &&
    keyboardStore.diodeDirection !== undefined
  )
})
const checkMatrix = () => {
  if (keyboardStore.cols < 0) keyboardStore.cols = 0
  if (keyboardStore.rows < 0) keyboardStore.rows = 0
  if (keyboardStore.pins < 0) keyboardStore.pins = 0
}
</script>

<style lang="scss" scoped>
.grid-visualizer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  width: 100%;
}

.row {
  display: flex;
  gap: 4px;
}

.col {
  width: 40px;
  height: 40px;
  border: 1px solid white;
  opacity: 0.7;
  @apply rounded;
}
</style>
