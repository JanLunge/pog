<template>
  Here you can connect to a keyboard via serial for more verbose debug output. <br />
  Note: This is still very much a work in progress. <br />
  <br />
  <ul class="ml-4 list-disc">
    <li>First create a reload key on your keymap and press it to reload the keyboard</li>
    <li>
      Then, press connect to connect to the keyboard (the keyboard has 2 serial consoles,connect to
      the first one with the lower number for debugging)
    </li>
    <li>Then you can see the output below</li>
    <li>
      If the output does not appear unplug and replug the keyboard and try again (this is the WIP
      part)
    </li>
  </ul>
  <div>
    <div class="my-2 flex justify-between gap-2">
      <select v-model="selectedPort" class="select">
        <option v-for="port in sortedPorts" :key="port.port" :value="port.port">
          {{ port.manufacturer }} - {{ port.port }} - {{ port.serialNumber }}
        </option>
      </select>

      <button class="btn" :disabled="!selectedPort" @click="connect">connect</button>
    </div>
    <textarea
      v-model="output"
      class="textarea w-full p-2"
      id="repl-output"
      style="min-height: 200px"
      readonly
    ></textarea>
    <div class="flex gap-2">
      <input v-model="inputData" class="input input-sm w-full" @keyup.enter="sendData" />
      <button class="btn btn-sm" @click="sendData">Send</button>
    </div>
    <div class="flex">
      <button class="btn btn-sm" @click="enterRepl">enter REPL</button>
      <button class="btn btn-sm" @click="exitRepl">exit REPL</button>
      <div v-if="statusMessage" class="pl-1 pt-2 text-sm text-gray-500">
        <div class="badge badge-outline">{{ statusMessage }}</div>
      </div>
      <div class="form-control absolute right-4">
        <label class="label cursor-pointer">
          <input
            v-model="autoscroll"
            type="checkbox"
            class="checkbox checkbox-sm"
          />
          <span class="label-text pl-1">autoscroll</span>
        </label>
      </div>
    </div>
    <div v-if="false" class="mt-4">
      <p>we can load some info from the controller to know what features it offers</p>
      <buttom class="btn">check which pins the controller has</buttom>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { keyboardStore } from '../store'

const output = ref('')
const inputData = ref('')
const ports = ref<any[]>([])
const selectedPort = ref('')
const statusMessage = ref('')
const autoscroll = ref(true)
const sortedPorts = computed(() => {
  return [...ports.value]
    .sort((a, b) => {
      if (a.port < b.port) {
        return -1
      }
      if (a.port > b.port) {
        return 1
      }
      return 0
    })
    .filter((a) => a.serialNumber !== undefined)
})

const scrollTextarea = () => {
  nextTick(() => {
    const replOutput = document.getElementById('repl-output')
    if (replOutput && autoscroll.value) {
      replOutput.scrollTop = replOutput.scrollHeight
    }
  })
}

onMounted(async () => {
  ports.value = await window.api.serialPorts()
  // select default port for the one with the current serial number

  window.api.serialData((event, data) => {
    console.log(event, data)
    output.value += data.message
    scrollTextarea()
  })
  console.log(keyboardStore)
})

const sendData = () => {
  window.api.serialSend(inputData.value)
  inputData.value = ''
}
const connect = async () => {
  try {
    await window.api.serialConnect(selectedPort.value)
    statusMessage.value = 'Connected!'
  } catch (error) {
    statusMessage.value = 'Failed to connect.'
    console.error('Failed to connect to the port:', error)
    alert('Failed to connect to the selected port.')
  }
}
const enterRepl = () => {
  window.api.serialSend('ctrlc')
  setTimeout(() => {
    window.api.serialSend('ctrlc')
  }, 1000)
}
const exitRepl = () => {
  window.api.serialSend('ctrld')
}
</script>

<style lang="scss" scoped></style>
