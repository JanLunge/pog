<template>
  <div class="flex">
    <ul
      class="menu bg-base-100 w-56 flex-shrink-0 border-r border-opacity-40 border-white"
    >
      <li class="p-4 text-xl font-bold flex items-center">
        <img src="@renderer/assets/icon.png" alt="" class="w-24 rounded" />
      </li>
      <li class="text-xs pl-4 py-2" >Selected Keyboard</li>
      <li class="p-4 pt-0 flex items-center">
        <span
          @click="reselectKeyboard"
          class="rounded text-center bg-primary text-xs text-black w-full cursor-pointer opacity-70 hover:opacity-100"
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
    <div class="px-4 pt-8 flex-1 overflow-x-auto h-screen">
      <h1 class="text-5xl font-bold text-center mb-8" contenteditable="true">Keyboard Config</h1>
      <router-view></router-view>
      <div class="py-4 flex justify-center">
        <div class="btn btn-sm btn-primary" @click="saveKeymap">
          Save python code to Keyboard
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from '../store'
import {useRouter} from "vue-router";
const router = useRouter()
const reselectKeyboard = () => {
  router.push('/')
}

// pass pog.json to backend to convert it ? or convert it here
const saveKeymap = async () => {
  // save to pog.json
  const saveResponse = await window.electronAPI.saveKeymap(
    JSON.stringify(keyboardStore.serialize())
  );
};
</script>

<style lang="scss" scoped></style>
