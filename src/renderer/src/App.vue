<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { addToHistory, keyboardStore, notifications, serialKeyboards } from './store'
import { addSerialLine } from './store/serial'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = computed(() => {
  return keyboardStore
})
console.log('store added to debug menu', store)

window.api.keyboardScan((_event: Event, value: { keyboards }) => {
  console.log('found keyboards via serial', value)
  serialKeyboards.value = value.keyboards.map((a) => {
    const b = a
    b.port = b.path
    delete b.path
    return b
  })
})

window.api.serialKeyboardPogConfig((_event: Event, value: { pogconfig }) => {
  console.log('loaded pog config', value)
  keyboardStore.import({
    path: '',
    serial: true,
    folderContents: ['pog.json', 'kmk'],
    configContents: value.pogconfig
  })
  if (keyboardStore.pogConfigured) {
    addToHistory(keyboardStore)
  }
  router.push('/configurator/keymap')
})

let serialHandler: ((event: any, data: { message: string }) => void) | null = null
onMounted(() => {
  serialHandler = (_event, data) => addSerialLine(data.message)
  window.api.serialData(serialHandler)
})
onUnmounted(() => {
  if (serialHandler) window.api.offSerialData(serialHandler)
  serialHandler = null
})
</script>

<template>
  <div class="notifications">
    <div v-for="(notification, nindex) in notifications" class="alert alert-error shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 flex-shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ notification.label }}</span>
        <button class="btn btn-ghost btn-sm" @click="notifications.splice(nindex, 1)">
          <i class="mdi mdi-close"></i>
        </button>
      </div>
    </div>
  </div>
  <router-view></router-view>
</template>
<style lang="scss">
html,
body,
#app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen-Sans, Ubuntu, Cantarell,
    Helvetica Neue, sans-serif;
}
.tooltip {
  @apply rounded bg-base-300 p-4 shadow;
  max-width: 300px;
}
.notifications {
  position: absolute;
  top: 0;
  display: flex;
  @apply z-20 flex-col gap-4 p-4;
}
</style>
