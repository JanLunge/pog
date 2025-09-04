<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="props.isVisible"
      class="fixed left-2 top-2 z-50 w-[350px] rounded-2xl border border-white/20 bg-base-100/10 p-4 text-xs shadow-2xl backdrop-blur-md"
    >
      <div class="mb-2 flex items-center gap-3">
        <div class="relative h-6 w-6">
          <Transition
            mode="out-in"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-90"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-90"
          >
            <div v-if="statusPhase !== 'reloaded'" key="spinner">
              <div class="h-6 w-6 rounded-full border-2 border-white/20"></div>
              <div
                class="absolute left-0 top-0 h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"
              ></div>
            </div>
            <div v-else key="check" class="flex h-6 w-6 items-center justify-center text-green-400">
              <i class="mdi mdi-check-circle-outline text-xl"></i>
            </div>
          </Transition>
        </div>
        <div class="flex items-baseline gap-2 text-white">
          <span class="text-base font-semibold">{{ headline }}</span>
        </div>
        <div class="ml-auto">
          <button class="btn btn-ghost btn-xs text-white/80" @click="toggleShowLogs">
            {{ showLogs ? 'Hide logs' : 'Show logs' }}
          </button>
        </div>
      </div>
      <div class="space-y-1 text-white">
        <div v-if="statusLine" class="opacity-90">{{ statusLine }}</div>
        <template v-if="showLogs">
          <div v-if="lastThreeSerialLines.length" class="my-1 h-px w-full bg-white/20"></div>
          <div v-for="(line, idx) in lastThreeSerialLines" :key="idx" class="opacity-70">
            {{ line }}
          </div>
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref, computed } from 'vue'
import { serialLogs } from '@renderer/store/serial'

interface Props {
  isVisible: boolean
  usingSerial?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  usingSerial: false
})

const emit = defineEmits<{
  (e: 'done'): void
}>()

const progress = ref<{
  state: 'writing' | 'done' | 'error' | ''
  filename?: string
  completed: number
  total: number
}>({ state: '', completed: 0, total: 0 })
const lastThreeSerialLines = computed(() => serialLogs.value.slice(0, 3))
type Phase = 'saving' | 'saved' | 'reloading' | 'reloaded' | 'error' | ''
const statusPhase = ref<Phase>('')
const statusLine = computed(() => {
  if (statusPhase.value === 'saved') return 'Saving successful'
  if (statusPhase.value === 'reloading') return 'Reloading keyboard…'
  if (statusPhase.value === 'reloaded') return 'Reload complete. Keyboard started.'
  if (statusPhase.value === 'error') return 'Error while saving'
  if (progress.value.filename) return `Writing: ${progress.value.filename}`
  return ''
})
const headline = computed(() => (statusPhase.value === 'reloaded' ? 'Done' : 'Saving…'))

let phaseEnterAt: number | null = null
let minHideTimeout: number | null = null
let pendingPhaseTimeout: number | null = null
let pendingAfterTimeout: number | null = null
let fallbackTimeout: number | null = null

const MIN_VISIBLE_MS = 500
const READY_MARKERS = [
  'initialising pogkeyboard',
  'initialising pogkeyboard',
  'use 6kro',
  'mem_info used:',
  'enable mouse'
]

let saveProgressHandler:
  | ((
      event: any,
      data: {
        state: 'writing' | 'done' | 'error'
        filename?: string
        completed: number
        total: number
      }
    ) => void)
  | null = null
let unwatchSerial: (() => void) | null = null
const hasTriggeredReady = ref(false)

// Show logs preference
const SHOW_LOGS_KEY = 'pog:overlay:showLogs'
const showLogs = ref(false)
const toggleShowLogs = () => {
  showLogs.value = !showLogs.value
  try {
    localStorage.setItem(SHOW_LOGS_KEY, showLogs.value ? '1' : '0')
  } catch {}
}

const enterPhase = (phase: Phase) => {
  statusPhase.value = phase
  phaseEnterAt = Date.now()
}

const transitionToWithMin = (phase: Phase, afterEntered?: () => void) => {
  const now = Date.now()
  const remaining = Math.max(0, MIN_VISIBLE_MS - (now - (phaseEnterAt ?? now)))
  if (pendingPhaseTimeout) {
    clearTimeout(pendingPhaseTimeout)
    pendingPhaseTimeout = null
  }
  if (pendingAfterTimeout) {
    clearTimeout(pendingAfterTimeout)
    pendingAfterTimeout = null
  }
  pendingPhaseTimeout = setTimeout(() => {
    enterPhase(phase)
    if (afterEntered) {
      pendingAfterTimeout = setTimeout(() => {
        afterEntered()
      }, MIN_VISIBLE_MS) as unknown as number
    }
  }, remaining) as unknown as number
}

const attachListeners = () => {
  if (!saveProgressHandler) {
    saveProgressHandler = (_event, data) => {
      progress.value = {
        state: data.state,
        filename: data.filename,
        completed: data.completed,
        total: data.total
      }
      if (data.state === 'error') {
        transitionToWithMin('error', () => scheduleDone())
      } else if (data.state === 'done') {
        transitionToWithMin('saved', () => transitionToWithMin('reloading'))
      }
    }
    window.api.onSaveConfigurationProgress(saveProgressHandler)
  }
  if (!unwatchSerial) {
    unwatchSerial = watch(
      () => serialLogs.value[0],
      (line) => {
        if (!line) return
        const lcline = String(line).toLowerCase()
        if (READY_MARKERS.some((m) => lcline.includes(m))) {
          console.log('ready marker', line)
          transitionToWithMin('reloaded', () => scheduleDone())
        }
      }
    )
  }
}

const detachListeners = () => {
  // Remove listeners explicitly to avoid duplicates across multiple saves
  if (saveProgressHandler) {
    window.api.offSaveConfigurationProgress(saveProgressHandler)
  }
  if (unwatchSerial) {
    unwatchSerial()
    unwatchSerial = null
  }
  saveProgressHandler = null
}

const scheduleDone = () => {
  const now = Date.now()
  const minUntil = (phaseEnterAt ?? now) + MIN_VISIBLE_MS
  const remaining = Math.max(0, minUntil - now)
  if (minHideTimeout) clearTimeout(minHideTimeout)
  minHideTimeout = setTimeout(() => {
    emit('done')
    // reset local state for next run
    progress.value = { state: '', completed: 0, total: 0 }
    statusPhase.value = ''
    phaseEnterAt = null
    hasTriggeredReady.value = false
    if (fallbackTimeout) {
      clearTimeout(fallbackTimeout)
      fallbackTimeout = null
    }
    if (pendingPhaseTimeout) {
      clearTimeout(pendingPhaseTimeout)
      pendingPhaseTimeout = null
    }
    if (pendingAfterTimeout) {
      clearTimeout(pendingAfterTimeout)
      pendingAfterTimeout = null
    }
  }, remaining) as unknown as number
}

watch(
  () => props.isVisible,
  (visible) => {
    if (visible) {
      enterPhase('saving')
      attachListeners()
      if (fallbackTimeout) clearTimeout(fallbackTimeout)
      // Safety: autohide after 15s
      fallbackTimeout = setTimeout(() => {
        scheduleDone()
      }, 15000) as unknown as number
    } else {
      detachListeners()
      if (minHideTimeout) {
        clearTimeout(minHideTimeout)
        minHideTimeout = null
      }
      if (pendingPhaseTimeout) {
        clearTimeout(pendingPhaseTimeout)
        pendingPhaseTimeout = null
      }
      if (pendingAfterTimeout) {
        clearTimeout(pendingAfterTimeout)
        pendingAfterTimeout = null
      }
      if (fallbackTimeout) {
        clearTimeout(fallbackTimeout)
        fallbackTimeout = null
      }
      progress.value = { state: '', completed: 0, total: 0 }
      statusPhase.value = ''
      phaseEnterAt = null
    }
  }
)

onMounted(() => {
  if (props.isVisible) {
    statusPhase.value = 'saving'
    attachListeners()
  }
  try {
    showLogs.value = localStorage.getItem(SHOW_LOGS_KEY) === '1'
  } catch {}
})

onUnmounted(() => {
  detachListeners()
  if (minHideTimeout) clearTimeout(minHideTimeout)
  if (fallbackTimeout) clearTimeout(fallbackTimeout)
  if (pendingPhaseTimeout) clearTimeout(pendingPhaseTimeout)
  if (pendingAfterTimeout) clearTimeout(pendingAfterTimeout)
})
</script>

<style scoped>
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
