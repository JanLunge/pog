<template>
  <div class="flex h-screen">
    <ul
      class="menu flex-shrink-0 bg-base-100"
      :class="{
        'menu-open': menuOpen
      }"
    >
      <li class="flex items-center p-4 text-xl font-bold" @click="iconClick">
        <img src="@renderer/assets/icon.png" alt="" class="w-24 rounded" />
      </li>
      <li class="flex items-center p-4 pt-0">
        <span
          class="w-full cursor-pointer rounded bg-base-300 text-center text-xs"
          @click="reselectKeyboard"
        >
          <i class="mdi mdi-keyboard"></i>
          {{ keyboardStore.name }}</span
        >
      </li>
      <li>
        <router-link to="/configurator/keymap"
          ><i class="mdi mdi-alphabetical-variant"></i>Keymap</router-link
        >
      </li>
      <li>
        <router-link to="/configurator/layout-editor"
          ><i class="mdi mdi-keyboard-variant"></i>Keyboard Layout</router-link
        >
      </li>
      <hr class="border-white border-opacity-20" />
      <li>
        <router-link to="/configurator/encoder"
          ><i class="mdi mdi-axis-z-rotate-clockwise"></i>Encoder</router-link
        >
      </li>
      <li>
        <router-link to="/configurator/info"
          ><i class="mdi mdi-information-outline"></i>Info</router-link
        >
      </li>
      <li><router-link to="/configurator/matrix"><i class="mdi mdi-grid"></i>Matrix</router-link></li>
      <li><router-link to="/configurator/pins"><i class="mdi mdi-electric-switch"></i>Pins</router-link></li>
      <li><router-link to="/configurator/coordmap"><i class="mdi mdi-sort-numeric-ascending"></i>CoordMap</router-link></li>
      <li><router-link to="/configurator/raw-keymap"><i class="mdi mdi-code-brackets"></i>Raw Keymap</router-link></li>
      <li><router-link to="/configurator/firmware"><i class="mdi mdi-flash"></i>Firmware</router-link></li>
      <!--      <li><router-link to="/configurator/community">Community</router-link></li>-->
    </ul>
    <div class="flex h-full flex-col overflow-y-auto w-full">
      <div class="py-4 flex items-center justify-between bg-base-100 shadow-xl z-10">
        <h1
          class="flex-grow text-center text-4xl font-bold overflow-auto"
          contenteditable="true"
          spellcheck="false"
          style="line-height: 48px; max-height: 100px "
        >
          {{ currentRouteName }}
        </h1>
        <div class="btn-primary btn mr-4" @click="saveKeymap">
          <i class="mdi mdi-content-save text-xl"></i>
        </div>
      </div>
      <div class="flex-grow overflow-y-auto px-4 pt-4 bg-base-200">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { addToHistory, keyboardStore } from '../store'
import { useRoute, useRouter } from 'vue-router'
import { computed, ref } from 'vue'
const router = useRouter()
const route = useRoute()

// nav guard
console.log('path is', keyboardStore.path)
if (!keyboardStore.path) {
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

const menuOpen = ref(true)

const iconClick = () => {
  menuOpen.value = !menuOpen.value
}
</script>

<style lang="scss" scoped>
.router-link-active {
  @apply font-bold text-primary;
}
.menu {
  width: 80px;
  //position: absolute;
  //height: 100px;
  overflow: hidden;
  overflow-y: auto;
  //border: none;
  //white-space: nowrap;
  flex-wrap: nowrap;
  * {
    white-space: nowrap;
  }
  li a {
    opacity: 0.5;
    &.router-link-active {
      opacity: 1;
    }
    &:focus {
      background: transparent;
      @apply text-primary;
    }
  }
}
.menu-open {
  width: 200px;
  position: relative;
  height: 100vh;
}
</style>
