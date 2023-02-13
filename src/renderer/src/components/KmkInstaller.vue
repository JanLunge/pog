<template>
  <div class="p-4 mt-4 text-left">
    <p>
      <a href="https://kmkfw.io/" target="_blank" class="link">KMK</a> is a capable firmware for
      keyboards using the rp2040.
    </p>
    <p>
      Before you proceed make sure you installed
      <a class="link" href="https://circuitpython.org/downloads" target="_blank">circuit python</a>
      on your controller
    </p>
    <p v-if="!keyboardStore.firmwareInstalled">
      You can let kmk automatically install to this keyboard
      <span class="font-mono">{{ keyboardStore.path }}</span>
    </p>
    <div class="flex justify-center">

    <div v-if="keyboardStore.firmwareInstalled" class="stats shadow-xl mt-8">
      <div class="stat text-left">
        <div class="stat-figure text-primary">
         <i class="mdi mdi-check text-3xl"></i>
        </div>
        <div class="stat-title">Firmware Installed</div>
        <div class="stat-value text-primary">KMK</div>
<!--        <div class="stat-desc">modified on</div>-->
      </div>
    </div>
    </div>
    <div
      v-if="keyboardStore.firmwareInstalled"
      class="flex justify-center mt-8"
    >
      <button class="btn btn-primary block mt-4" @click="$emit('next')">Next</button>

    </div>
    <button
      v-else-if="kmkInstallState !== 'done'"
      class="btn btn-primary mt-8"
      @click="updateKMK"
    >
      install KMK
    </button>
    <div v-if="['downloading'].includes(kmkInstallState)">
      <p class="m-4 mt-8">{{ kmkInstallState }}</p>
      <div
        class="radial-progress bg-primary text-primary-content border-4 border-primary"
        :style="{ '--value': progress }"
      >
        {{ isNaN(progress) ? 'Done' : progress }}%
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { keyboardStore } from '../store'

const progress = ref(0)
const kmkInstallState = ref('')

const updateKMK = async () => {
  await window.api.updateFirmware()
  kmkInstallState.value = 'downloading'
}

window.api.onUpdateFirmwareInstallProgress(
  (_event: Event, value: { state: string; progress: number }) => {
    console.log('kmk progress', value)
    // don't go back from done
    if (kmkInstallState.value !== 'done') {
      kmkInstallState.value = value.state
      console.log('progress', value.progress)
      progress.value = Math.round(value.progress)
      if (value.state === 'done') {
        // TODO: save kmk support to keyboard
        keyboardStore.firmwareInstalled = true
      }
    }
  }
)
</script>
