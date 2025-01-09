<template>
  <div class="flex flex-col items-center justify-center p-8">
    <h2 class="mb-6 text-2xl font-bold">CircuitPython Setup Required</h2>
    <div class="max-w-2xl rounded-lg bg-base-100 p-6">
      <p class="mb-4">
        Before configuring your keyboard with Pog, CircuitPython needs to be installed on your board.
      </p>
      <ol class="mb-4 list-inside list-decimal space-y-2">
        <li>Download CircuitPython
             for your board from circuitpython.org</li>
        <li>Connect your keyboard while holding the RESET button</li>
        <li>Copy the CircuitPython UF2 file to the mounted drive (the drive will be named RPI-RP2)</li>
        <li>Wait for the board to restart (if will show up as a drive named CIRCUITPY)</li>
      </ol>
      <p class="mb-4">
        Once CircuitPython is installed, your board will appear as a CIRCUITPY drive.
      </p>

      <!-- Drive Selection -->
      <div v-if="showDriveSelect" class="mt-6 space-y-4">
        <p class="font-medium">Select your CIRCUITPY drive:</p>
        <div v-if="drives.length > 0" class="space-y-2">
          <div
            v-for="drive in drives"
            :key="drive.path"
            class="cursor-pointer rounded-lg border p-3 transition-colors"
            :class="{
              'border-primary bg-primary/10': selectedDrive === drive.path
            }"
            @click="selectedDrive = drive.path"
          >
            <div class="flex items-center">
              <i class="mdi mdi-usb mr-2 text-xl"></i>
              <div>
                <p class="font-medium">{{ drive.name }}</p>
                <p class="text-sm text-gray-600">{{ drive.path }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-600">
          <p>No CIRCUITPY drives found.</p>
          <button
            class="mt-2 rounded border px-4 py-2 text-sm hover:bg-gray-50"
            @click="scanDrives"
          >
            Rescan
          </button>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="mt-6 flex gap-4">
        <button v-if="!showDriveSelect" class="btn" @click="router.back()">Back</button>
      <button v-if="!showDriveSelect" class="btn btn-primary" @click="showDriveSelect = true">
        Continue to Setup
      </button>
      <template v-else>
        <button class="btn" @click="showDriveSelect = false">Back</button>
        <button class="btn btn-primary" :disabled="!selectedDrive" @click="handleContinue">
          Continue
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import router from '../router'
import { keyboardStore } from '../store'

const showDriveSelect = ref(false)
const selectedDrive = ref('')
const drives = ref<{ path: string; name: string }[]>([])

async function scanDrives() {
  try {
    const result = await window.api.listDrives()
    // drives.value = result.filter(drive => 
    //   drive.name.toLowerCase().includes('circuitpy') ||
    //   drive.path.toLowerCase().includes('circuitpy')
    // )
    drives.value = result
  } catch (error) {
    console.error('Failed to scan drives:', error)
  }
}

function handleContinue() {
  if (selectedDrive.value) {
    // emit('continue', selectedDrive.value)
    keyboardStore.path = selectedDrive.value
    router.push('/automatic-setup/method')
  }
}

// const emit = defineEmits(['continue'])

onMounted(() => {
  scanDrives()
})
</script> 