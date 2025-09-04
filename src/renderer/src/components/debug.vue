<template>
  <div class="flex h-full flex-col">
    <div class="mb-2 text-sm">
      <div class="mb-2 flex items-center justify-between">
        <h3 class="font-bold">Debug Console</h3>
        <div class="form-control">
          <label class="label cursor-pointer">
            <input v-model="autoscroll" type="checkbox" class="checkbox checkbox-xs" />
            <span class="label-text pl-1 text-xs">autoscroll</span>
          </label>
        </div>
      </div>
      <div class="mb-2 text-xs opacity-70">
        Connect to your keyboard's serial console for debugging. Press the reload key on your
        keyboard first.
      </div>
    </div>

    <div class="mb-2 flex gap-2">
      <div class="flex flex-grow gap-2">
        <select
          v-model="selectedPort"
          class="select select-sm flex-grow"
          :disabled="isConnected || isConnecting"
        >
          <option value="">Select a port</option>
          <option v-for="port in sortedPorts" :key="port.port" :value="port.port">
            {{ port.manufacturer }} - {{ port.port }}
          </option>
        </select>
        <button
          class="btn btn-square btn-sm"
          :disabled="isConnected || isConnecting"
          @click="refreshPorts"
        >
          <i class="mdi mdi-refresh"></i>
        </button>
      </div>

      <button
        v-if="!isConnected"
        class="btn btn-sm"
        :disabled="!selectedPort || isConnecting"
        @click="connect"
      >
        {{ isConnecting ? 'Connecting...' : 'Connect' }}
      </button>
      <button v-else class="btn btn-error btn-sm" @click="disconnect">Disconnect</button>
    </div>

    <div v-if="statusMessage" class="mb-2">
      <div class="badge badge-sm" :class="isConnected ? 'badge-success' : 'badge-error'">
        {{ statusMessage }}
      </div>
    </div>

    <textarea
      id="repl-output"
      v-model="output"
      class="textarea textarea-bordered mb-2 flex-grow p-2 font-mono text-xs"
      readonly
    ></textarea>

    <div class="mb-2 flex gap-2">
      <input
        v-model="inputData"
        class="input input-bordered input-sm flex-grow text-xs"
        :disabled="!isConnected"
        placeholder="Enter command..."
        @keyup.enter="sendData"
      />
      <button class="btn btn-sm" :disabled="!isConnected" @click="sendData">Send</button>
    </div>

    <div class="flex gap-2">
      <button class="btn btn-sm flex-grow" :disabled="!isConnected" @click="enterRepl">
        Enter REPL
      </button>
      <button class="btn btn-sm flex-grow" :disabled="!isConnected" @click="exitRepl">
        Exit REPL
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { keyboardStore } from '@renderer/store'
import { serialLogs } from '@renderer/store/serial'

const output = ref('')
const inputData = ref('')
const ports = ref<any[]>([])
const selectedPort = ref('')
const statusMessage = ref('')
const autoscroll = ref(true)
const isConnected = ref(false)
const isConnecting = ref(false)

const sortedPorts = computed(() => {
  return [...ports.value]
    .filter((a) => a.serialNumber !== undefined)
    .sort((a, b) => {
      // First try to match by serial number if available
      if (keyboardStore.serialNumber) {
        const aMatchesSerial = a.serialNumber === keyboardStore.serialNumber
        const bMatchesSerial = b.serialNumber === keyboardStore.serialNumber
        if (aMatchesSerial && !bMatchesSerial) return -1
        if (!aMatchesSerial && bMatchesSerial) return 1
      }
      
      // Then sort by port number
      const aNum = parseInt(a.port.replace(/[^\d]/g, ''))
      const bNum = parseInt(b.port.replace(/[^\d]/g, ''))
      if (aNum < bNum) return -1
      if (aNum > bNum) return 1
      return 0
    })
})

// Auto-connect to the first available port when ports are refreshed
watch(sortedPorts, (newPorts) => {
  if (!isConnected.value && !isConnecting.value && newPorts.length > 0) {
    selectedPort.value = newPorts[0].port
    connect()
  }
}, { immediate: true })

const scrollTextarea = () => {
  nextTick(() => {
    const replOutput = document.getElementById('repl-output')
    if (replOutput && autoscroll.value) {
      replOutput.scrollTop = replOutput.scrollHeight
    }
  })
}
const unwatch = ref<() => void>()
onMounted(async () => {
  await refreshPorts()
  // serial handler now centralized in App.vue via store/serial
  // Listen for updates by watching the store instead of attaching listeners here
  // Keep textarea in sync
  unwatch.value = watch(
    () => serialLogs.value,
    (logs) => {
      output.value = logs.slice().reverse().join('\n') + '\n'
      scrollTextarea()
    },
    { immediate: true, deep: true }
  )
  window.api.serialConnectionStatus((_event: Event, status: any) => {
    console.log('Connection status:', status)
    isConnected.value = status.connected
    isConnecting.value = false
    statusMessage.value = status.connected ? 'Connected' : status.error || 'Disconnected'
  })
})

onUnmounted(() => {
  unwatch.value?.()
})

const refreshPorts = async () => {
  try {
    ports.value = await window.api.serialPorts()
    if (ports.value.length === 0) {
      statusMessage.value = 'No ports available'
    }
  } catch (error) {
    console.error('Failed to refresh ports:', error)
    statusMessage.value = 'Failed to refresh ports'
  }
}

const sendData = () => {
  if (!isConnected.value) {
    statusMessage.value = 'Not connected'
    return
  }
  if (!inputData.value.trim()) {
    return
  }
  window.api.serialSend(inputData.value)
  inputData.value = ''
}

const connect = async () => {
  if (!selectedPort.value) {
    statusMessage.value = 'Please select a port'
    return
  }

  try {
    isConnecting.value = true
    statusMessage.value = 'Connecting...'
    await window.api.serialConnect(selectedPort.value)
  } catch (error: any) {
    console.error('Failed to connect to the port:', error)
    statusMessage.value = error.message || 'Failed to connect'
    isConnecting.value = false
    isConnected.value = false
  }
}

const disconnect = async () => {
  try {
    statusMessage.value = 'Disconnecting...'
    await window.api.serialDisconnect()
    isConnected.value = false
    selectedPort.value = ''
    statusMessage.value = 'Disconnected'
  } catch (error: any) {
    console.error('Failed to disconnect:', error)
    statusMessage.value = error.message || 'Failed to disconnect'
  }
}

const enterRepl = () => {
  if (!isConnected.value) {
    statusMessage.value = 'Not connected'
    return
  }
  statusMessage.value = 'Entering REPL...'
  window.api.serialSend('ctrlc')
  setTimeout(() => {
    window.api.serialSend('ctrlc')
  }, 1000)
}

const exitRepl = () => {
  if (!isConnected.value) {
    statusMessage.value = 'Not connected'
    return
  }
  statusMessage.value = 'Exiting REPL...'
  window.api.serialSend('ctrld')
}
</script>

<style lang="scss" scoped></style>
