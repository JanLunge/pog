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
      <button class="btn" @click="connect">connect</button>
    </div>
    <textarea
      v-model="output"
      class="textarea w-full p-2"
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
    </div>
    <div class="mt-4" v-if="false">
      <p>we can load some info from the controller to know what features it offers</p>
      <buttom class="btn">check which pins the controller has</buttom>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { keyboardStore } from '../store'

const output = ref('')
const inputData = ref('')
const ports = ref<any[]>([])
const selectedPort = ref('')
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
onMounted(async () => {
  ports.value = await window.api.serialPorts()
  // select default port for the one with the current serial number

  window.api.serialData((event, data) => {
    console.log(event, data)
    output.value += data.message
  })
  console.log(keyboardStore)
})

const sendData = () => {
  window.api.serialSend(inputData.value)
  inputData.value = ''
}
const connect = () => {
  window.api.serialConnect(selectedPort.value)
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
