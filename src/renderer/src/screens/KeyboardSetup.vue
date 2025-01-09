<template>
  <div class="min-h-screen bg-base-200">
    <div class="container mx-auto py-8">
      <router-view
        @setup-complete="handleSetupComplete"
      ></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { keyboardStore } from '../store'

function handleSetupComplete(config: any) {
  // Update the keyboard store with the detected configuration
  keyboardStore.rows = config.rows
  keyboardStore.cols = config.cols
  keyboardStore.diodeDirection = config.diodeDirection
  keyboardStore.coordMapSetup = true
  keyboardStore.pinPrefix = 'board'
  
  // Navigate to the keymap editor
//   router.push('/configurator/keymap')
}
</script> 