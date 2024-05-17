<template>
  <div class="mb-2 grid grid-cols-2 gap-2">
    <div class="mb-8 flex justify-center">
      <div class="w-full max-w-md">
        <p class="mb-2 text-sm">Keyboard Type</p>
        <select v-model="keyboardStore.keyboardType" class="select select-bordered mb-2 w-full">
          <option value="normal">Normal</option>
          <option value="splitBle">Split (Bluetooth)</option>
          <option value="splitSerial">Split (Serial)</option>
          <option value="splitOnewire">Split (1 Pin)</option>
        </select>

        <p class="mb-2 text-sm">Wiring Method</p>
        <select v-model="keyboardStore.wiringMethod" class="select select-bordered mb-2 w-full">
          <option value="matrix">Matrix</option>
          <option value="direct">Direct Pins</option>
        </select>
      </div>
    </div>
    <div class="mb-8 flex items-center justify-center">
      <p class="max-w-md py-4">
        Define the type of your keyboard and the wiring method.<br /><br />
        For matrix set the size of the keyboard matrix here, set it as big as you need. For easier
        wiring set it to the max number of cols/rows on your keyboard<br /><br />
        For direct pins set the number of pins you have available
      </p>
    </div>
  </div>
  <!-- Wiring Method -->
  <div class="mt-5 flex justify-center gap-8">
    <div class="mb-8">
      <template v-if="keyboardStore.wiringMethod === 'matrix'">
        <div class="mb-4 grid grid-cols-1 gap-2 rounded bg-base-100 p-2 py-8">
          <p class="flex items-center justify-center text-xl font-bold">Matrix Size</p>
          <div class="grid grid-cols-5 items-center gap-2">
            <span class="mr-2 text-right">Width</span>
            <InputLabel
              v-model="keyboardStore.cols"
              class="input-bordered col-span-4"
              placeholder="1"
              input-type="number"
              :min="0"
              @input="checkMatrix"
            ></InputLabel>
            <span class="mr-2 text-right">Height</span>
            <InputLabel
              v-model="keyboardStore.rows"
              class="input-bordered col-span-4"
              placeholder="1"
              input-type="number"
              :min="0"
              @input="checkMatrix"
            ></InputLabel>
          </div>
        </div>
      </template>
      <template v-if="keyboardStore.wiringMethod === 'direct'">
        <div class="mb-4 grid grid-cols-1 gap-2 rounded bg-base-100 p-2 py-8">
          <p class="flex items-center justify-center text-xl font-bold">Pin Count</p>
          <div class="grid grid-cols-5 items-center gap-2">
            <span class="mr-2 text-right">Pins</span>
            <InputLabel
              v-model="keyboardStore.pins"
              class="input-bordered col-span-4"
              placeholder="1"
              input-type="number"
              :min="1"
              @input="checkMatrix"
            ></InputLabel>
          </div>
        </div>
      </template>
    </div>
    <div v-if="keyboardStore.keyboardType !== 'normal'" class="flex w-1/2 flex-col items-center">
      <div class="mb-4 grid grid-cols-1 gap-2 rounded bg-base-100 p-2 py-8">
        <p class="flex items-center justify-center text-xl font-bold">Split Configuration</p>
        <p class="px-2 py-2 text-sm italic">
          Define how each half of the split keyboard is detected.<br />
          Config will use a property in the config file<br />
          VBUS will use the VBUS pin (prefix: board.)to detect the side, <br />
          Label will use last letter of the drive label to detect the side
        </p>
        <select v-model="keyboardStore.splitSide" class="select select-bordered mb-2">
          <option value="left">Config (Left)</option>
          <option value="right">Config (Right)</option>
          <option value="vbus">VBUS</option>
          <option value="label">Drive Label (L/R)</option>
        </select>
        <label v-if="keyboardStore.splitSide === 'vbus'" class="mb-2 flex items-center gap-2">
          <span>VBUS Pin</span>
          <input v-model="keyboardStore.vbusPin" type="text" class="input input-bordered" />
        </label>
        <div v-if="keyboardStore.keyboardType === 'splitSerial'">
          <p class="px-2 py-2 text-sm italic">
            Define the serial pins used to connect the two halves, this is using the pin prefix from
            the `pins` tab
          </p>
          <label class="mb-2 flex items-center gap-2">
            <span>SplitPin A</span>
            <input v-model="keyboardStore.splitPinA" type="text" class="input input-bordered" />
          </label>
          <label class="mb-2 flex items-center gap-2">
            <span>SplitPin B</span>
            <input v-model="keyboardStore.splitPinB" type="text" class="input input-bordered" />
          </label>
        </div>
        <div v-if="keyboardStore.keyboardType === 'splitOnewire'">
          <p class="flex items-center justify-center text-xl font-bold">Onewire Data Pin</p>
          <p class="px-2 py-2 text-sm italic">
            Define the data pin used to connect the two halves, this is using the pin prefix from
            the `pins` tab
          </p>
          <label class="flex items-center gap-2">
            <span>DataPin</span>
            <input v-model="keyboardStore.splitPinA" type="text" class="input input-bordered" />
          </label>
        </div>
      </div>
    </div>
  </div>

  <div v-if="keyboardStore.wiringMethod === 'matrix'" class="grid-visualizer">
    <div v-for="_row in keyboardStore.rows" class="row">
      <div v-for="_col in keyboardStore.cols" class="col"></div>
    </div>
  </div>
  <div v-if="initialSetup" class="my-8 flex justify-center">
    <button class="btn btn-primary" :class="{ 'btn-disabled': matrixEmpty }" @click="$emit('next')">
      Next
    </button>
  </div>
</template>

<script lang="ts" setup>
import InputLabel from './ui/InputLabel.vue'
import { keyboardStore } from '../store'
import { computed, watch } from 'vue'

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
