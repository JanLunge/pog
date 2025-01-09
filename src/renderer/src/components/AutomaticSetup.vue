<template>
  <div class="min-h-screen bg-base-100 p-6">
    <div class="mx-auto max-w-5xl space-y-8">
      <div class="flex items-center justify-between">
        <h2 class="text-center text-4xl font-bold text-base-content">Mapping your Pinout</h2>
        <button class="btn btn-ghost" @click="toggleDebug">
          <i class="mdi mdi-bug text-2xl" :class="{ 'text-primary': showDebug }"></i>
        </button>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Detection Info Panel -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-xl font-bold text-base-content">Detected Configuration</h3>
            <div class="space-y-4 text-base-content/80">
              <div class="flex justify-between">
                <span class="font-medium">Row Pins:</span>
                <span class="font-mono text-primary">{{ detectionData.rows.join(', ') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Column Pins:</span>
                <span class="font-mono text-primary">{{ detectionData.cols.join(', ') }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Total Keys:</span>
                <span class="font-mono text-primary">{{ detectionData.pressedKeys.length }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Matrix Size:</span>
                <span class="font-mono text-primary"
                  >{{ detectionData.rows.length }}x{{ detectionData.cols.length }}</span
                >
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Total Pins:</span>
                <span class="font-mono text-primary">{{
                  detectionData.cols.length + detectionData.rows.length
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Instructions Panel -->
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h3 class="card-title text-xl font-bold text-base-content">Instructions</h3>
            <div class="space-y-4">
              <p class="text-base-content/80">To map your keyboard matrix, please:</p>
              <ol class="list-inside list-decimal space-y-3 text-base-content/80">
                <li class="flex items-center space-x-2">
                  <span class="font-medium">1.</span>
                  <span>Press each key on your keyboard exactly once</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="font-medium">2.</span>
                  <span>Make sure to hit all keys, including modifiers</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="font-medium">3.</span>
                  <span>Watch the key preview below light up as you press</span>
                </li>
                <li class="flex items-center space-x-2">
                  <span class="font-medium">4.</span>
                  <span>Click "Done" when you've pressed all keys</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug Panel -->
      <div v-if="showDebug" class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <Debug />
        </div>
      </div>

      <!-- Key Preview -->
      <div class="card bg-base-200 shadow-lg">
        <div class="card-body">
          <h3 class="card-title text-xl font-bold text-base-content">Key Press Preview</h3>
          <div class="grid w-full grid-cols-[repeat(auto-fill,minmax(48px,1fr))] gap-2 p-4">
            <div
              v-for="(key, index) in detectionData.pressedKeys"
              :key="index"
              class="flex h-12 items-center justify-center rounded-lg font-medium transition-all duration-200"
              :class="{
                'bg-base-300 text-base-content': !(
                  detectionData.lastKeyPress &&
                  detectionData.lastKeyPress.row === key.row &&
                  detectionData.lastKeyPress.col === key.col
                ),
                'scale-105 bg-primary text-primary-content shadow-md':
                  detectionData.lastKeyPress &&
                  detectionData.lastKeyPress.row === key.row &&
                  detectionData.lastKeyPress.col === key.col
              }"
            >
              {{ index + 1 }}
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex justify-center">
        <button class="btn btn-primary" @click="proceed">Done pressing keys</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@renderer/router'
import { keyboardStore } from '@renderer/store'
import { ref, onMounted, onUnmounted } from 'vue'
import Debug from './debug.vue'

const showDebug = ref(false)
const detectionData = ref<{
  rows: string[]
  cols: string[]
  pressedKeys: { row: number; col: number }[]
  lastKeyPress: { row: number; col: number } | null
}>({
  rows: [],
  cols: [],
  pressedKeys: [],
  lastKeyPress: null
})

onMounted(async () => {
  await window.api.startDetection()
})

function handleDetectionUpdate(data: any, event: any) {
  //   detectionData.value = data
  console.log('handleDetectionUpdate', data, event)
  switch (event.type) {
    case 'new_key_press':
      detectionData.value.pressedKeys.push({ row: event.row, col: event.col })
      detectionData.value.lastKeyPress = { row: event.row, col: event.col }
      break
    case 'existing_key_press':
      detectionData.value.lastKeyPress = { row: event.row, col: event.col }
      if (
        !detectionData.value.pressedKeys.some(
          (key) => key.row === event.row && key.col === event.col
        )
      ) {
        detectionData.value.pressedKeys.push({ row: event.row, col: event.col })
      }
      break
    case 'used_pins':
      detectionData.value.rows = event.rows
      detectionData.value.cols = event.cols
      break
  }
}

function proceed() {
  // Emit completion event with configuration
  // window.api.stopDetection()
  // detectionData.value
  keyboardStore.rowPins = detectionData.value.rows
  keyboardStore.colPins = detectionData.value.cols
  keyboardStore.rows = detectionData.value.rows.length
  keyboardStore.cols = detectionData.value.cols.length
  keyboardStore.diodeDirection = 'ROW2COL'
  keyboardStore.coordMapSetup = true
  keyboardStore.pinPrefix = 'board'

  router.push('/automatic-setup/firmware')
}

defineEmits(['setup-complete'])

onMounted(() => {
  console.log('onMounted')
  window.api.onDetectionUpdate((data: any, event: any) => handleDetectionUpdate(data, event))
})

onUnmounted(() => {
  //   window.api.removeDetectionListeners()
  //   window.api.stopDetection()
})

function toggleDebug() {
  showDebug.value = !showDebug.value
}
</script>
