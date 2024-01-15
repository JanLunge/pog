<template>
  <div class="mt-4 p-4 text-left">
    <p>
      <a href="https://kmkfw.io/" target="_blank" class="link">KMK</a> is a capable firmware for
      keyboards using the rp2040.
    </p>
    <p>
      Before you proceed make sure you installed
      <a class="link" href="https://circuitpython.org/downloads" target="_blank">circuit python</a>
      on your controller
    </p>
    <p>
      info: this does not work when the controller is only connected via the serial port (and not as mounted usb drive)
    </p>
    <p v-if="!keyboardStore.firmwareInstalled">
      You can let kmk automatically install to this keyboard
      <span class="font-mono">{{ keyboardStore.path }}</span>
    </p>
    <div class="flex justify-center">
      <div v-if="keyboardStore.firmwareInstalled" class="stats mt-8 shadow-xl">
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
    <div class="mt-8 flex justify-center">
      <button v-if="keyboardStore.firmwareInstalled" class="btn btn-primary mt-4 block" @click="$emit('next')">
        Next
      </button>
      <button v-else class="btn mt-4 block" @click="$emit('next')">
              I install it manually

      </button>
    </div>
    <div v-if="[''].includes(kmkInstallState)" class="mt-8 flex justify-center items-center flex-col">
      <button class="btn-primary btn mt-8" @click="updateKMK"> {{keyboardStore.firmwareInstalled? 'update': 'install'}} KMK</button>

    </div>
    <div class="mt-4 flex flex-col items-center justify-center" v-if="['downloading', 'copying', 'unpacking'].includes(kmkInstallState)" >
      <p class="m-4 mt-8">{{ kmkInstallState || '' }}</p>
      <progress
        class="progress progress-primary w-56"
        :value="progress"
        max="100"
      ></progress>
      <span v-if="progress !== 0">
      {{ isNaN(progress) ? 'Done' : progress }}%
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { keyboardStore } from '../store'
import dayjs from "dayjs";

const progress = ref(0)
const kmkInstallState = ref('')

defineProps(['initialSetup'])

const startTime = ref(dayjs())
const endTime = ref(dayjs())
const updateKMK = async () => {
  await window.api.updateFirmware()
  kmkInstallState.value = 'downloading'
  startTime.value = dayjs()
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
        keyboardStore.firmwareInstalled = true
        endTime.value = dayjs()
        console.log(startTime.value, endTime.value)
      }
    }
  }
)
</script>
