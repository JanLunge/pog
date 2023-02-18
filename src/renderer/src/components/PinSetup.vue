<template>
  <div class="flex items-center justify-center">
    <p class="py-4 max-w-md">Define the mapping for columns and rows to the microcontroller pins</p>
  </div>

  <div class="flex justify-center">
    <div class="max-w-md w-full">
      <p class="text-sm mb-2">Diode Direction</p>
      <select v-model="keyboardStore.diodeDirection" class="select select-bordered w-full">
        <option value="COL2ROW">COL2ROW</option>
        <option value="ROW2COL">ROW2COL</option>
      </select>
    </div>
  </div>
  <div class="w-full flex justify-center my-8">
    <button
      v-if="initialSetup"
      class="btn btn-primary"
      :class="{ 'btn-disabled': !pinsCompleted }"
      @click="$emit('next')"
    >
      Next
    </button>
  </div>
  <div class="flex gap-8 mt-5 justify-center">
    <div v-if="keyboardStore.wiringMethod === 'matrix'" class="flex-grow-0">
      <div class="rounded bg-base-300 p-2 grid grid-cols-1 gap-2 mb-4 py-8" style="width: 350px">
        <p class="pb-4 font-bold text-xl flex items-center justify-center">
          Row Pins
          <span class="ml-2 badge badge-primary font-bold">{{ keyboardStore.rowPins.length }}</span>
        </p>
        <div
          v-for="(_pin, index) in keyboardStore.rowPins"
          class="grid grid-cols-6 items-center gap-2"
        >
          <p class="mr-2 text-right">{{ index + 1 }}</p>
          <input
            v-model="keyboardStore.rowPins[index]"
            class="input input-sm input-bordered col-span-4"
            type="text"
            placeholder="17"
          />
        </div>
      </div>
      <div class="rounded bg-base-300 p-2 grid grid-cols-1 gap-2 mb-4 py-8">
        <p class="pb-4 font-bold text-xl flex items-center justify-center">
          Column Pins
          <span class="ml-2 badge badge-primary font-bold">{{ keyboardStore.colPins.length }}</span>
        </p>
        <div
          v-for="(_pin, index) in keyboardStore.colPins"
          class="grid grid-cols-6 items-center gap-2"
        >
          <span class="mr-2 text-right">{{ index + 1 }}</span>
          <input
            v-model="keyboardStore.colPins[index]"
            class="input input-sm input-bordered col-span-4"
            type="text"
            placeholder="17"
          />
        </div>
      </div>
    </div>
    <div v-if="keyboardStore.wiringMethod === 'direct'" class="flex-grow-0">
      <div class="rounded bg-base-300 p-2 grid grid-cols-1 gap-2 mb-4 py-8" style="width: 350px">
        <p class="pb-4 font-bold text-xl flex items-center justify-center">
          Direct Pins
          <span class="ml-2 badge badge-primary font-bold">{{
            keyboardStore.directPins.length
          }}</span>
        </p>
        <div
          v-for="(_pin, index) in keyboardStore.directPins"
          class="grid grid-cols-6 items-center gap-2"
        >
          <p class="mr-2 text-right">{{ index + 1 }}</p>
          <input
            v-model="keyboardStore.directPins[index]"
            class="input input-sm input-bordered col-span-4"
            type="text"
            placeholder="17"
          />
        </div>
      </div>
    </div>
    <div class="w-1/2 flex flex-col items-center" style="width: 400px">
      <div class="w-full">

      <p class="text-sm mb-2">Microcontroller</p>
      <select v-model="keyboardStore.controller" class="select select-bordered w-full">
        <option value="0xcb-helios">0xCB Helios</option>
        <option value="">other</option>
      </select>
      </div>
      <div v-if="keyboardStore.controller === '0xcb-helios'">
        <p class="py-4">
          The
          <a
            class="link link-primary"
            target="_blank"
            href="https://keeb.supply/products/0xcb-helios"
            >0xCB Helios</a
          >
          is an Elite-C compatible MicroController that is based on the RP2040.
        </p>
        <img
          src="@renderer/assets/microcontrollers/0xcb-helios.png"
          alt=""
          width="400"
          height="300"
        />
      </div>
      <div v-if="!keyboardStore.controller">
        <ul class="py-4">
          <li>
            <a
              class="link link-primary"
              target="_blank"
              href="https://datasheets.raspberrypi.com/pico/Pico-R3-A4-Pinout.pdf"
              >Pi Pico</a
            >
          </li>
        </ul>
        <p class="py-4">
          feel free to submit other microcontroller pinouts just make sure you have the permission
          to use the pinout image if it has not been created by you, in the mean time here are links
          to other pinouts
        </p>
        <p>currently this tool works with any RP2040 controller.</p>
        <p class="py-4">just look for a pinout and use any pin that is starting with GP</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
// import { useRouter } from 'vue-router'
import { keyboardStore } from '../store'
// const router = useRouter()

defineProps(['initialSetup'])

// validate pin count
if (keyboardStore.wiringMethod === 'matrix') {
  if (keyboardStore.rows !== keyboardStore.rowPins.length) {
    keyboardStore.rowPins = Array.from(
      { length: keyboardStore.rows },
      (_x, i) => keyboardStore.rowPins[i]
    )
    keyboardStore.rowPins = keyboardStore.rowPins.slice(0, keyboardStore.rows)
  }

  if (keyboardStore.cols !== keyboardStore.colPins.length) {
    keyboardStore.colPins = Array.from(
      { length: keyboardStore.cols },
      (_x, i) => keyboardStore.colPins[i]
    )
    keyboardStore.colPins = keyboardStore.colPins.slice(0, keyboardStore.cols)
  }
} else if (keyboardStore.wiringMethod === 'direct') {
  keyboardStore.directPins = Array.from(
    { length: keyboardStore.pins },
    (_x, i) => keyboardStore.directPins[i]
  )
  keyboardStore.directPins = keyboardStore.directPins.slice(0, keyboardStore.pins)
}

const pinsCompleted = computed(() => {
  if (keyboardStore.colPins.includes('')) return false
  if (keyboardStore.rowPins.includes('')) return false
  return true
})

</script>

<style lang="scss" scoped>
.controller-labels {
  @apply grid absolute;
  width: 130px;
  padding-top: 15px;
  font-size: 14px;
  line-height: 21.4px;
  font-family: Monospaced 'Lucida Console';
  z-index: 2;
  &-right {
    @apply text-left right-0;
    //width: 188px;
  }
  &-left {
    @apply text-right;
  }
  &-bottom {
    transform: rotateZ(-90deg);
    @apply text-right;
    top: 295px;
    left: 128px;
  }
  & > div {
    @apply px-3 rounded;
    &:hover {
      background: #666666;
    }
  }
}
</style>
