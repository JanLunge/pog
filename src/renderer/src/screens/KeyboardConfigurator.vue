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
      <li><router-link to="/configurator/info">Info</router-link></li>
      <li><router-link to="/configurator/matrix">Matrix</router-link></li>
      <li><router-link to="/configurator/pins">Pins</router-link></li>
      <li><router-link to="/configurator/coordmap">CoordMap</router-link></li>
      <li><router-link to="/configurator/raw-keymap">Raw Keymap</router-link></li>
      <li><router-link to="/configurator/firmware">Firmware</router-link></li>
<!--      <li><router-link to="/configurator/community">Community</router-link></li>-->
    </ul>
    <div class="h-screen flex-1 overflow-x-auto px-4 pt-8">
      <h1 class="mb-8 text-center text-5xl font-bold" contenteditable="true">
        {{ currentRouteName }}
      </h1>
      <router-view></router-view>
      <div class="flex items-center justify-center gap-2 py-4">
        <Popper :hover="true">
          <label class="flex items-center justify-center">
            <i class="mdi mdi-auto-fix mr-2"></i>
            <input v-model="flashingMode" type="checkbox" class="checkbox" />
          </label>
          <template #content>
            <div class="tooltip">
              <p class="font-bold">Manual / Automatic</p>
              <p>
                when enabled pog will manage your files, when disabled pog will only write to the
                keymap file, this means you need to manage imports in the code.py yourself and sync
                any changes for the matrix width or direct pin order in pog for proper keycode
                lookup.
              </p>
            </div>
          </template>
        </Popper>
        <div class="btn-primary btn-sm btn" @click="saveKeymap">
          <i class="mdi mdi-content-save"></i>Save python code to Keyboard
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Popper from '@wlard/vue3-popper'
import { addToHistory, keyboardStore } from '../store'
import { useRoute, useRouter} from 'vue-router'
import { computed } from 'vue'
const router = useRouter()
const route = useRoute()

// nav guard
console.log('path is',keyboardStore.path)
if(!keyboardStore.path){
  router.push('/')
}

const reselectKeyboard = () => {
  router.push('/')
}

const saveKeymap = async () => {
  // save to keyboard history
  keyboardStore.coordMapSetup = false
  const keyboardData = keyboardStore.serialize()
  addToHistory(keyboardStore)
  console.log(keyboardStore.coordMapSetup)
  await window.api.saveConfiguration(
    JSON.stringify({ pogConfig: keyboardData, writeFirmware: true })
  )
}

const currentRouteName = computed(() => route.matched[1].name)

const flashingMode = computed({
  get() {
    return keyboardStore.flashingMode === 'automatic'
  },
  set(newVal) {
    keyboardStore.flashingMode = newVal ? 'automatic' : 'manual'
  }
})

</script>

<style lang="scss" scoped>
.router-link-active {
  @apply bg-primary font-bold text-black;
}
</style>
