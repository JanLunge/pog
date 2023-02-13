<template>
  <div
    class=" flex flex-col items-center w-full h-full"
  >
    <div class="flex-grow-0">
      <h1 class="text-5xl font-bold my-4 mt-8 text-center">Initial Keyboard Setup</h1>
      <div class="flex text-center">
        <div class="badge badge-primary badge-outline p-4 m-2 mb-8 mr-6">
          Keyboard: {{ keyboardStore.path }}
        </div>
        <div class="btn btn-circle btn-primary" @click="$router.push('/')">
          <i class="mdi mdi-sync text-xl"></i>
        </div>
      </div>

      <ul class="steps w-full mb-2 w-full">
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 0 }"
          @click="currentStep = 0"
        >
          Firmware
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 1 }"
          @click="currentStep > 1 ? (currentStep = 1) : undefined"
        >
          Matrix
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 2 }"
          @click="currentStep > 2 ? (currentStep = 2) : undefined"
        >
          Pins
        </li>
        <li
          class="step"
          :class="{ 'step-primary': currentStep >= 3 }"
          @click="currentStep > 3 ? (currentStep = 3) : undefined"
        >
          Layout
        </li>
      </ul>
    </div>
    <div class="overflow-y-auto flex-grow-1 px-8">
      <KmkInstaller v-if="currentStep === 0" @next="currentStep++" />
      <MatrixSetup v-if="currentStep === 1" @next="currentStep++" />
      <PinSetup v-if="currentStep === 2" @next="currentStep++" />
      <LayoutEditor v-if="currentStep === 3" @next="$emit('next')" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from "../store";
import { ref } from "vue";

import KmkInstaller from "../components/KmkInstaller.vue";
import MatrixSetup from "../components/MatrixSetup.vue";
import PinSetup from "../components/PinSetup.vue";
import LayoutEditor from "../components/LayoutEditor.vue";

// const steps = ref(["kmk", "matrix", "pins", "layout"]);
const currentStep = ref(0);
</script>

<style lang="scss" scoped>

</style>
