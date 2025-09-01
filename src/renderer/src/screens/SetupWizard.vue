<template>
  <div class="flex h-full w-full flex-col items-center">
    <div class="flex-grow-0">
      <h1 class="my-4 mt-8 text-center text-5xl font-bold">Initial Keyboard Setup</h1>
      <div class="mb-8 flex items-center justify-center gap-4 text-center">
        <div class="badge badge-primary badge-outline p-4">Keyboard: {{ keyboardStore.path }}</div>
        <div class="btn btn-circle btn-primary" @click="$router.push('/')">
          <i class="mdi mdi-sync text-xl"></i>
        </div>
      </div>

      <ul class="steps mb-2 w-full w-full">
        <li class="step" :class="{ 'step-primary': currentStep >= 0 }" @click="currentStep = 0">
          Firmware
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 1 }"
          @click="currentStep > 1 ? (currentStep = 1) : undefined"
        >
          Name
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 2 }"
          @click="currentStep > 2 ? (currentStep = 2) : undefined"
        >
          Matrix
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 3 }"
          @click="currentStep > 3 ? (currentStep = 3) : undefined"
        >
          Pins
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 4 }"
          @click="currentStep > 4 ? (currentStep = 4) : undefined"
        >
          Coordmap
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 5 }"
          @click="currentStep > 5 ? (currentStep = 5) : undefined"
        >
          Layout
        </li>
      </ul>
    </div>
    <div id="step-scroller" class="flex-grow-1 h-full overflow-y-auto px-8">
      <KmkInstaller v-if="currentStep === 0" :initial-setup="true" @next="currentStep++" />
      <keyboard-name v-if="currentStep === 1" :initial-setup="true" @next="currentStep++" />
      <MatrixSetup v-if="currentStep === 2" :initial-setup="true" @next="currentStep++" />
      <PinSetup v-if="currentStep === 3" :initial-setup="true" @next="currentStep++" />
      <CoordMap v-if="currentStep === 4" :initial-setup="true" @next="currentStep++" />
      <LayoutEditor v-if="currentStep === 5" :initial-setup="true" @next="toConfigurator" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from '../store'
import { ref, watch } from 'vue'

import KmkInstaller from '../components/KmkInstaller.vue'
import MatrixSetup from '../components/MatrixSetup.vue'
import PinSetup from '../components/PinSetup.vue'
import LayoutEditor from '../components/LayoutEditor.vue'
import KeyboardName from '../components/KeyboardName.vue'
import { useRouter } from 'vue-router'
import CoordMap from '../components/CoordMap.vue'

const router = useRouter()

// const steps = ref(["kmk", "matrix", "pins", "layout"]);
const currentStep = ref(0)
const toConfigurator = () => {
  router.push('/configurator/keymap')
}

watch(currentStep, () => {
  const scroller = document.querySelector('#step-scroller')
  if (scroller) {
    scroller.scrollTop = 0
  }
})
</script>

<style lang="scss" scoped></style>
