<template>
  <div class="flex flex-col items-center justify-center p-8">
    <h2 class="mb-6 text-2xl font-bold">Choose Setup Method</h2>
    <div class="mb-8 text-center">
      <p class="mb-2">
        {{
          kmkInstallState !== 'done'
            ? 'Installing firmware... (should take up to 10 seconds)'
            : 'Firmware installed'
        }}
      </p>
      <progress v-if="kmkInstallState !== 'done'" class="progress progress-primary w-56"></progress>
      <p v-else>
        initial Firmware install complete, please unplug your keyboard and plug it back in to
        continue
      </p>
    </div>
    <div v-if="kmkInstallState === 'done'">
      <!-- Serial Port Selection -->
      <h3 class="mb-3 text-xl font-semibold">Serial Port</h3>
      <p class="mb-4 text-center">
        Select the serial port for your keyboard. We've automatically detected the most likely port.
        <button class="btn btn-primary btn-sm mt-2" @click="scanPorts">Rescan</button>
      </p>

      <div class="space-y-4">
        <div v-if="ports.length > 0" class="space-y-2">
          <div
            v-for="port in ports"
            :key="port.port"
            class="cursor-pointer rounded-lg border p-3 transition-colors"
            :class="{
              'border-primary bg-primary/10': selectedPort === port.port
            }"
            @click="selectPort(port)"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium">{{ port.port }}</p>
                <p class="text-sm text-gray-600">
                  {{ port.manufacturer || 'Unknown manufacturer' }}
                  {{ port.serialNumber ? `(${port.serialNumber})` : '' }}
                </p>
              </div>
              <div v-if="isRecommendedPort(port)" class="text-sm text-green-600">Recommended</div>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-600">
          <p>No serial ports found.</p>
          <button class="mt-2 rounded border px-4 py-2 text-sm hover:bg-gray-50" @click="scanPorts">
            Rescan
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Setup Method Selection -->
  <div v-if="selectedPort" class="grid max-w-4xl grid-cols-2 gap-8 p-4">
    <div
      class="cursor-pointer rounded-lg bg-base-200 p-6 transition-colors"
      :class="{
        'pointer-events-none cursor-not-allowed opacity-20': !selectedPort,
        'hover:bg-base-200': selectedPort
      }"
      @click="selectMethod('manual')"
    >
      <h3 class="mb-3 text-xl font-semibold text-base-content">Manual Setup</h3>
      <p class="">
        Configure your keyboard manually by specifying the pins, rows, columns, and diode direction.
        Recommended for experienced users or if you have your keyboard's documentation.
      </p>
    </div>
    <div
      class="cursor-pointer rounded-lg bg-base-200 p-6 transition-colors"
      :class="{
        'pointer-events-none cursor-not-allowed opacity-20': !selectedPort,
        'hover:bg-base-200': selectedPort
      }"
      @click="selectMethod('automatic')"
    >
      <h3 class="mb-3 text-xl font-semibold">Automatic Detection (Experimental)</h3>
      <p class="">
        Let Pog automatically detect your keyboard's configuration by pressing each key. We'll flash
        a special firmware and guide you through the process.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { keyboardStore } from '@renderer/store'
import { ref, onMounted } from 'vue'
import router from '../router'
// import { directiveHooks } from '@vueuse/core'

interface SerialPort {
  port: string
  manufacturer?: string
  serialNumber?: string
}

const ports = ref<SerialPort[]>([])
const selectedPort = ref('')
async function scanPorts() {
  try {
    const result = await window.api.serialPorts()
    console.log('raw serialPorts', result)
    // Group ports by serial number
    const portsBySerial = result.reduce((acc, port) => {
      if (port.serialNumber) {
        if (!acc[port.serialNumber]) {
          acc[port.serialNumber] = []
        }
        acc[port.serialNumber].push(port)
      }
      return acc
    }, {} as Record<string, SerialPort[]>)
    console.log('portsBySerial', portsBySerial)
    // Sort ports within each group and take only the first port (lower number)
    ports.value = Object.entries(portsBySerial).map(([serialNumber, ports]) => {
      ports.sort((a, b) => a.port.localeCompare(b.port))
      // Store both ports in the keyboard store
      if (ports.length >= 2) {
        const keyboard = {
          serialNumber,
          serialPortA: ports[0].port,
          serialPortB: ports[1].port,
          manufacturer: ports[0].manufacturer,
          port: ports[0].port, // Keep the first port as the main port for backwards compatibility
          hasDataSerial: ports.length >= 2
        }
        return keyboard
      }
      return ports[0]
      // return false
    })
    //   .filter((port) => port !== false)
    console.log('ports', ports.value)

    // Auto-select recommended port if available
    const recommended = ports.value.find((port) => isRecommendedPort(port))
    if (recommended?.serialNumber) {
      keyboardStore.serialNumber = recommended.serialNumber
    }
  } catch (error) {
    console.error('Failed to scan ports:', error)
  }
}

function isRecommendedPort(port: SerialPort): boolean {
  const manufacturer = port.manufacturer?.toLowerCase() || ''
  return (
    manufacturer.includes('circuitpython') ||
    manufacturer.endsWith('-pog') ||
    manufacturer.startsWith('pog-') ||
    manufacturer === 'pog'
  )
}

function selectPort(port: SerialPort) {
  console.log('selectPort', port)
  keyboardStore.serialNumber = port.serialNumber || 'not found'
  selectedPort.value = port.port
}

function selectMethod(method: 'manual' | 'automatic') {
  if (keyboardStore.serialNumber) {
    handleMethodSelect({ method })
  }
}

const progress = ref(0)
const kmkInstallState = ref('')

onMounted(() => {
  scanPorts()
  // flash the firmware
  window.api.flashDetectionFirmware({
    drivePath: keyboardStore.path || ''
    // serialNumber: keyboardStore.serialNumber
  })
})

window.api.onUpdateFirmwareInstallProgress(
  (_event: Event, value: { state: string; progress: number }) => {
    console.log('kmk progress', value)
    kmkInstallState.value = value.state
    progress.value = Math.round(value.progress)
  }
)

async function handleMethodSelect({ method }: { method: 'manual' | 'automatic' }) {
  try {
    // Connect to the serial port first
    // await window.api.serialConnect(port)
    // keyboardStore.usingSerial = true
    // save the serial number
    if (method === 'manual') {
      router.push('/setup-wizard')
    } else {
      console.log('flashing detection firmware', keyboardStore.path, keyboardStore.serialNumber)
      // For automatic setup, we need to flash the detection firmware first
      window.api.flashDetectionFirmware({
        drivePath: keyboardStore.path || '',
        serialNumber: keyboardStore.serialNumber
      })
      router.push('/automatic-setup/mapping')
    }
  } catch (error) {
    console.error('Failed to setup keyboard:', error)
    // TODO: Show error to user
  }
}
</script>
