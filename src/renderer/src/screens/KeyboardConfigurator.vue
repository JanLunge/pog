<template>
  <div class="flex">
    <ul class="menu w-56 flex-shrink-0 border-r border-white border-opacity-40 bg-base-100">
      <li class="flex items-center p-4 text-xl font-bold">
        <img src="@renderer/assets/icon.png" alt="" class="w-24 rounded" />
      </li>
      <li class="py-2 pl-4 text-xs">Selected Keyboard</li>
      <li class="flex items-center p-4 pt-0">
        <span
          class="w-full cursor-pointer rounded bg-primary text-center text-xs text-black opacity-70 hover:opacity-100"
          @click="reselectKeyboard"
          >{{ keyboardStore.name }}</span
        >
      </li>
      <li><router-link to="/configurator/keymap">Keymap</router-link></li>
      <li><router-link to="/configurator/layout-editor">Keyboard Layout</router-link></li>
      <hr class="border-white border-opacity-40" />
      <li><router-link to="/configurator/encoder">Encoder</router-link></li>
      <li><router-link to="/configurator/matrix">Matrix</router-link></li>
      <li><router-link to="/configurator/pins">Pins</router-link></li>
      <li><router-link to="/configurator/raw-keymap">Raw Keymap</router-link></li>
      <li><router-link to="/configurator/firmware">Firmware</router-link></li>
    </ul>
    <div class="h-screen flex-1 overflow-x-auto px-4 pt-8">
      <h1 class="mb-8 text-center text-5xl font-bold" contenteditable="true">Keyboard Config</h1>
      <router-view></router-view>
      <div class="flex justify-center py-4">
        <div class="btn-primary btn-sm btn" @click="saveKeymap">Save python code to Keyboard</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from '../store'
import { useRouter } from 'vue-router'
const router = useRouter()
const reselectKeyboard = () => {
  router.push('/')
}

// pass pog.json to backend to convert it ? or convert it here
const saveKeymap = async () => {
  // save to pog.json
  const saveResponse = await window.api.saveConfiguration(
    JSON.stringify({ pogConfig: keyboardStore.serialize(), writeFirmware: true })
  )
}
</script>

<style lang="scss" scoped></style>
