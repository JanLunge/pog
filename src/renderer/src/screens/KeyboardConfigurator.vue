<template>
  <div class="flex h-screen">
    <ul
      class="menu flex-shrink-0 bg-base-100"
      :class="{
        'menu-open': menuOpen
      }"
    >
      <li class="flex items-center p-4 text-xl font-bold" @click="iconClick">
        <img src="@renderer/assets/icon.png" alt="" class="h-24 rounded" />
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
      <li>
        <router-link to="/configurator/encoder"
          ><i class="mdi mdi-axis-z-rotate-clockwise"></i>Encoder</router-link
        >
      </li>
      <li>
        <router-link to="/configurator/rgb"><i class="mdi mdi-led-on"></i>RGB</router-link>
      </li>
      <hr class="border-white border-opacity-20" />
      <li>
        <router-link to="/configurator/info"
          ><i class="mdi mdi-information-outline"></i>Info</router-link
        >
      </li>
      <li>
        <router-link to="/configurator/matrix"><i class="mdi mdi-grid"></i>Matrix</router-link>
      </li>
      <li>
        <router-link to="/configurator/pins"
          ><i class="mdi mdi-electric-switch"></i>Pins</router-link
        >
      </li>
      <li>
        <router-link to="/configurator/coordmap"
          ><i class="mdi mdi-sort-numeric-ascending"></i>CoordMap</router-link
        >
      </li>
      <li>
        <router-link to="/configurator/raw-keymap"
          ><i class="mdi mdi-code-brackets"></i>Raw Keymap</router-link
        >
      </li>
      <li>
        <router-link to="/configurator/firmware"><i class="mdi mdi-flash"></i>Firmware</router-link>
      </li>
    </ul>
    <div class="flex h-full w-full flex-col overflow-y-auto">
      <div class="z-10 flex items-center justify-between bg-base-100 py-4 shadow-xl">
        <h1
          id="navTitle"
          class="flex-grow overflow-auto text-center text-4xl font-bold"
          contenteditable="true"
          spellcheck="false"
          style="line-height: 48px; max-height: 100px"
        >
          {{ currentRouteName }}
        </h1>
        <div class="btn btn-ghost mr-4" @click="info">
          <i class="mdi mdi-help-circle-outline text-2xl"></i>
        </div>
        <div class="btn btn-primary mr-4" @click="saveKeymap">
          <i class="mdi mdi-content-save text-2xl"></i>
        </div>
        <div class="btn mr-4" :class="{ 'btn-primary': showDebug }" @click="toggleDebug">
          <i class="mdi mdi-bug text-2xl"></i>
        </div>
      </div>
      <div class="flex flex-grow overflow-hidden bg-base-200">
        <div class="flex-grow overflow-y-auto px-4 pt-4">
          <router-view></router-view>
        </div>
        <div
          v-show="showDebug"
          class="w-[600px] flex-shrink-0 overflow-y-auto border-l border-base-300 bg-base-100 p-4"
        >
          <Debug />
        </div>
      </div>
    </div>
  </div>

  <LoadingOverlay
    :is-visible="isLoading"
    :using-serial="keyboardStore.usingSerial"
    @done="hideLoadingOverlay"
  />
</template>

<script lang="ts" setup>
import { addToHistory, keyboardStore } from '../store'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Debug from '../components/debug.vue'
import LoadingOverlay from '../components/LoadingOverlay.vue'

const router = useRouter()
const route = useRoute()
const showDebug = ref(false)
const isLoading = ref(false)

// nav guard
console.log('path is', keyboardStore.path)
if (!keyboardStore.path && !keyboardStore.usingSerial) {
  router.push('/')
}

const toggleDebug = () => {
  showDebug.value = !showDebug.value
}

const reselectKeyboard = () => {
  window.api.deselectKeyboard()
  router.push('/')
}

let fallbackTimeout: number | null = null

const saveKeymap = async () => {
  if (isLoading.value) return
  try {
    isLoading.value = true
    keyboardStore.coordMapSetup = false
    const keyboardData = keyboardStore.serialize()
    addToHistory(keyboardStore)
    console.log(keyboardStore.coordMapSetup)
    await window.api.saveConfiguration(
      JSON.stringify({ pogConfig: keyboardData, serial: keyboardStore.usingSerial })
    )

    // Only use parent fallback when not using serial; overlay has its own fallback when using serial
    if (!keyboardStore.usingSerial) {
      fallbackTimeout = setTimeout(() => {
        if (isLoading.value) hideLoadingOverlay()
      }, 15000) as unknown as number
    }
  } catch (error) {
    console.error('Error saving keymap:', error)
    hideLoadingOverlay()
  }
}

const hideLoadingOverlay = () => {
  if (fallbackTimeout) {
    clearTimeout(fallbackTimeout)
    fallbackTimeout = null
  }
  isLoading.value = false
}

const currentRouteName = computed(() => route.matched[1]?.name)

const menuOpen = ref(true)

const iconClick = () => {
  // menuOpen.value = !menuOpen.value
  reselectKeyboard()
}

onMounted(() => {
  const title = document.getElementById('navTitle')
  title?.addEventListener('blur', () => {
    if (typeof currentRouteName.value === 'string') {
      title.innerText = currentRouteName.value
    }
  })
  title?.addEventListener('focus', () => {
    title.innerText = ''
  })
})

onUnmounted(() => {
  if (fallbackTimeout) {
    clearTimeout(fallbackTimeout)
    fallbackTimeout = null
  }
  isLoading.value = false
})

const info = () => {
  // TODO: open a browser window with the help docs for this route
  window.api.openExternal('https://pog.heaper.de/docs/intro')
}
</script>

<style lang="scss" scoped>
.router-link-active {
  @apply font-bold text-primary;
}
.menu {
  width: 80px;
  overflow: hidden;
  overflow-y: auto;
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
/* Fallback spinner animation in case Tailwind's animate-spin is unavailable */
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
