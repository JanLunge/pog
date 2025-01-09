<template>
  <div class="flex items-center justify-center">
    <p class="max-w-md py-4">
      Define the mapping for columns and rows to the microcontroller pins. For split keyboards
      define the method for detecting the split side.
    </p>
  </div>
  <div v-if="initialSetup" class="my-8 flex w-full justify-center">
    <button
      class="btn btn-primary"
      :class="{ 'btn-disabled': !pinsCompleted }"
      @click="$emit('next')"
    >
      Next
    </button>
  </div>
  <div class="mt-5 flex justify-center gap-8">
    <!-- LEFT COLUMN -->
    <div class="flex-grow-0">
      <div
        v-if="keyboardStore.wiringMethod === 'matrix'"
        class="mb-4 grid grid-cols-1 gap-2 rounded bg-base-100 p-2 py-8"
        style="width: 350px"
      >
        <p class="flex items-center justify-center pb-4 text-xl font-bold">
          Row Pins
          <span class="badge badge-primary ml-2 font-bold">{{ keyboardStore.rowPins.length }}</span>
        </p>
        <div
          v-for="(_pin, index) in keyboardStore.rowPins"
          class="grid grid-cols-6 items-center gap-2"
        >
          <p class="mr-2 text-right">{{ index }}</p>
          <input
            v-model="keyboardStore.rowPins[index]"
            class="input input-bordered input-sm col-span-4"
            type="text"
            placeholder="17"
          />
        </div>
      </div>
      <div
        v-if="keyboardStore.wiringMethod === 'matrix'"
        class="mb-4 grid grid-cols-1 gap-2 rounded bg-base-100 p-2 py-8"
        style="width: 350px"
      >
        <p class="flex items-center justify-center pb-4 text-xl font-bold">
          Column Pins
          <span class="badge badge-primary ml-2 font-bold">{{ keyboardStore.colPins.length }}</span>
        </p>
        <div
          v-for="(_pin, index) in keyboardStore.colPins"
          class="grid grid-cols-6 items-center gap-2"
        >
          <span class="mr-2 text-right">{{ index }}</span>
          <input
            v-model="keyboardStore.colPins[index]"
            class="input input-bordered input-sm col-span-4"
            type="text"
            placeholder="17"
          />
        </div>
      </div>
      <div
        v-if="keyboardStore.wiringMethod === 'direct'"
        class="mb-4 grid grid-cols-1 gap-2 rounded bg-base-100 p-2 py-8"
        style="width: 350px"
      >
        <p class="flex items-center justify-center pb-4 text-xl font-bold">
          Direct Pins
          <span class="badge badge-primary ml-2 font-bold">{{
            keyboardStore.directPins.length
          }}</span>
        </p>
        <div
          v-for="(_pin, index) in keyboardStore.directPins"
          class="grid grid-cols-6 items-center gap-2"
        >
          <p class="mr-2 text-right">{{ index }}</p>
          <input
            v-model="keyboardStore.directPins[index]"
            class="input input-bordered input-sm col-span-4"
            type="text"
            placeholder="17"
          />
        </div>
      </div>
      <div
        v-if="showVbusOption"
        class="mb-4 grid w-full grid-cols-1 gap-2 rounded bg-base-100 p-2 py-8"
        style="width: 350px"
      >
        <p class="flex items-center justify-center pb-4 text-xl font-bold">
          Split Pins <span class="badge badge-primary ml-2 font-bold">{{ numberOfSplitPins }}</span>
        </p>
        <div v-if="keyboardStore.splitSide === 'vbus'">
          <label class="mb-2 flex items-center gap-2">
            <span>VBUS Pin</span>
            <input
              v-model="keyboardStore.vbusPin"
              type="text"
              class="input input-bordered input-sm col-span-4"
            />
          </label>
          <p class="px-2 py-2 text-sm italic">{{ vbusPinHint }}</p>
        </div>
        <div>
          <label
            v-if="keyboardStore.keyboardType === 'splitOnewire'"
            class="mb-2 flex items-center gap-2"
          >
            <span class="mr-2 text-right">SplitPin</span>
            <input
              v-model="keyboardStore.splitPinA"
              type="text"
              class="input input-bordered input-sm col-span-4"
            />
          </label>
          <label
            v-if="keyboardStore.keyboardType === 'splitSerial'"
            class="mb-2 flex items-center gap-2"
          >
            <span class="mr-2 text-right">SplitPin A</span>
            <input
              v-model="keyboardStore.splitPinA"
              type="text"
              class="input input-bordered input-sm col-span-4"
            />
          </label>
          <label
            v-if="keyboardStore.keyboardType === 'splitSerial'"
            class="mb-2 flex items-center gap-2"
          >
            <span class="mr-2 text-right">SplitPin B</span>
            <input
              v-model="keyboardStore.splitPinB"
              type="text"
              class="input input-bordered input-sm col-span-4"
            />
          </label>
          <p class="px-2 py-2 text-sm italic">{{ splitPinHint }}</p>
        </div>
      </div>
    </div>
    <!-- RIGHT COLUMN -->
    <div class="flex w-1/3 flex-col items-center" style="width: 400px">
      <div class="mb-4 w-full">
        <p class="mb-2 text-sm">Pin Prefix</p>
        <select v-model="keyboardStore.pinPrefix" class="select select-bordered mb-2 w-full">
          <option value="gp">GP</option>
          <option value="none">none</option>
          <option value="board">board</option>
          <option value="quickpin">quickpin</option>
        </select>
        <p class="px-2 py-2 text-sm italic">{{ pinPrefixHint }}</p>
      </div>

      <div v-if="keyboardStore.wiringMethod === 'matrix'" class="mb-4 w-full">
        <p class="mb-2 text-sm">Diode Direction</p>
        <select v-model="keyboardStore.diodeDirection" class="select select-bordered mb-2 w-full">
          <option value="COL2ROW">COL2ROW</option>
          <option value="ROW2COL">ROW2COL</option>
        </select>
      </div>

      <div v-if="keyboardStore.isSplit()" class="mb-4 w-full">
        <p class="mb-2 text-sm">Split Side Detection</p>
        <select v-model="keyboardStore.splitSide" class="select select-bordered mb-2 w-full">
          <option value="left">Config (Left)</option>
          <option value="right">Config (Right)</option>
          <option v-if="showVbusOption" value="vbus">VBUS</option>
          <option value="label">Drive Label (L/R)</option>
        </select>
        <p class="px-2 py-2 text-sm italic">{{ splitSideHint }}</p>
      </div>

      <div class="mt-4 w-full">
        <p class="mb-2 text-sm">Microcontroller</p>
        <select v-model="keyboardStore.controller" class="select select-bordered w-full">
          <option
            v-for="microcontroller of microcontrollers"
            :key="microcontroller.id"
            :value="microcontroller.id"
          >
            {{ microcontroller.name }}
          </option>
          <option value="">other</option>
        </select>
      </div>
    </div>
    <div class="flex w-1/3 flex-col items-center">
      <div v-if="selectedMicrocontroller.id">
        <p class="py-4" v-html="selectedMicrocontroller.information"></p>
        <img
          v-if="selectedMicrocontroller.image"
          :src="`/src/assets/microcontrollers/${selectedMicrocontroller.id}.png`"
          :alt="`Pinout Image of ${selectedMicrocontroller.name}`"
          class="board-image"
        />
        <small class="license-link base-300">
          Image License:
          <a
            :href="selectedMicrocontroller.licenseUrl"
            target="_blank"
            class="link-primary pr-1"
            v-text="selectedMicrocontroller.license"
          ></a
          >|<a :href="selectedMicrocontroller.imageUrl" target="_blank" class="link-primary pl-1"
            >source</a
          >
        </small>
      </div>

      <div v-if="!keyboardStore.controller">
        <p class="py-4">
          Feel free to submit other microcontroller pinouts. Ensure you have the permission to use
          the pinout image if it has not been created by you. In the meantime here are links to
          other pinouts
        </p>
        <p>Currently this tool works with any RP2040 controller.</p>
        <p class="py-4">Just look for a pinout and use any pin that is starting with GP.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue' // import { useRouter } from 'vue-router'
import { keyboardStore, pinPrefixHint, splitPinHint, splitSideHint, vbusPinHint } from '../store' // const router = useRouter()
import microcontrollers from '@renderer/assets/microcontrollers/microcontrollers.json'

defineProps<{ initialSetup: boolean }>()
defineEmits(['next'])
const selectedMicrocontroller = computed(
  () =>
    microcontrollers.find((m) => m.id == keyboardStore.controller) || {
      id: false,
      license: '',
      licenseUrl: '',
      information: '',
      imageUrl: '',
      name: '',
      image: ''
    }
)

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

const showVbusOption = computed(() => {
  return (
    keyboardStore.keyboardType === 'splitSerial' || keyboardStore.keyboardType === 'splitOnewire'
  )
})

const numberOfSplitPins = computed(() => {
  let pins = 0
  if (keyboardStore.splitSide === 'vbus') pins++
  if (keyboardStore.keyboardType === 'splitSerial') return pins + 2
  if (keyboardStore.keyboardType === 'splitOnewire') return pins + 1
  return pins
})
</script>
<style lang="scss" scoped>
.license-link {
  font-size: 0.55em;
}

.board-image {
  //width: 180px;
  //max-width: 180px;
  max-height: 60vh;
  height: auto;
  font-size: 0.7em;
  background-size: contain;
}

.controller-labels {
  @apply absolute grid;
  width: 130px;
  padding-top: 15px;
  font-size: 14px;
  line-height: 21.4px;
  font-family: 'Lucida Console', monospace;
  z-index: 2;

  &-right {
    @apply right-0 text-left;
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
    @apply rounded px-3;
    &:hover {
      background: #666666;
    }
  }
}
</style>
