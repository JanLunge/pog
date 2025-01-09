<template>
  <div class="min-h-screen bg-base-100 p-6">
    <div class="mx-auto max-w-2xl space-y-8">
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-2xl font-bold text-base-content text-center">Installing Firmware</h2>
          
          <!-- Status Display -->
          <div class="text-center space-y-4 py-4">
            <div class="text-lg font-medium text-base-content/80 capitalize">
              {{ kmkInstallState || 'Preparing...' }}
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full">
              <progress 
                class="progress progress-primary w-full" 
                :value="progress" 
                :max="100"
              ></progress>
              <div class="text-sm text-base-content/60 mt-2">
                {{ progress }}% Complete
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@renderer/router'
import { keyboardStore } from '@renderer/store'
import { onMounted, ref } from 'vue'

const progress = ref(0)
const kmkInstallState = ref('')

const updateKMK = async () => {
  await window.api.updateFirmware()
  kmkInstallState.value = 'downloading'
}

const updatePOG = async () => {
  window.api.saveConfiguration(
    JSON.stringify({ pogConfig: keyboardStore.serialize(), writeFirmware: true })
  )
}
onMounted(() => {
  updateKMK()
})

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
        updatePOG()
        router.push('/configurator/coordmap')
      }
    }
  }
)
</script>
<style lang="scss" scoped></style>
