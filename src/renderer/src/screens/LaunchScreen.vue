<template>
  <div class="flex flex-col p-4">
    <div class="flex flex-col items-center">
      <div class="flex items-center gap-2">
        <img src="../assets/icon.png" alt="" class="w-16" />
      </div>
      <p class="pt-6">Effortlessly customize your keyboard with Pog</p>
    </div>
    <div class="text-2xl font-bold">Your Keyboards</div>
    <div class="divider"></div>
    <div class="my-4 flex flex-col items-center justify-center gap-2">
      <p>select the circuit python drive of your keyboard</p>
      <button class="btn-primary btn" @click="selectDrive">
        <i class="mdi mdi-plus mr-1 text-lg"></i><span class="text-xs">add new keyboard</span>
      </button>
    </div>
    <div class="text-center italic opacity-50">
      (Note: your controller needs to be running
      <a href="https://circuitpython.org/downloads" target="_blank" class="link">circuit python</a>)
    </div>
    <div>
      <p>keyboards connected via serial</p>
      <div v-for="keyboard in serialKeyboards">
        {{ keyboard.name }}
        <button class="btn-primary btn" @click="selectKeyboard(keyboard)">use</button>
      </div>
    </div>
    <div class="">
      <div class="keyboard-list">
        <div
          v-for="keyboard in keyboardHistory"
          :key="keyboard.id"
          class="keyboard-preview"
          @click="selectKeyboard(keyboard)"
        >
          <div class="image">
            <div class="h-full w-full overflow-hidden p-2">
              <keyboard-layout
                :key-layout="keyboard.keys"
                :keymap="keyboard.keymap"
                :matrix-width="keyboard.cols"
                :layouts="keyboard.layouts"
                mode="static"
                :fixed-height="true"
              ></keyboard-layout>
            </div>
          </div>
          <div class="relative flex flex-grow flex-col">
            <p v-if="serialKeyboards.find((a) => a.id === keyboard.id && !a.driveMounted)">
              <span class="rounded bg-info p-1 text-xs"> Serial </span>
            </p>
            <p v-else-if="keyboard.path">
              <span
                v-if="serialKeyboards.find((a) => a.id === keyboard.id)"
                class="mr-2 rounded bg-gray-600 p-1 text-xs"
              >
                Serial available
              </span>
              <span class="rounded bg-accent p-1 text-xs">USB Drive</span>
            </p>
            <p v-else><span class="rounded bg-error p-1 text-xs">Read Only Serial</span></p>
            <button
              class="btn-ghost btn-sm btn absolute top-0 right-0"
              @click.stop="removeFromHistory(keyboard)"
            >
              <i class="mdi mdi-close"></i>
            </button>
            <p class="font-bold">{{ keyboard.name }}</p>
            <p class="mt-2 mt-2 text-xs italic">{{ keyboard.path }}</p>
            <p class="mt-2">{{ keyboard.description }}</p>
            <div>
              <div
                v-for="tag in keyboard.tags"
                :key="tag"
                class="badge"
                :style="{ backgroundColor: '#ea871a' }"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import {
  keyboardStore,
  keyboardHistory,
  addToHistory,
  notifications,
  KeyboardStore,
  selectedLayer,
  serialKeyboards
} from '../store'
import KeyboardLayout from '../components/KeyboardLayout.vue'
import { onMounted, ref } from 'vue'
const router = useRouter()

selectedLayer.value = 0

const selectDrive = async () => {
  const keyboard = await window.api.selectDrive()
  console.log(keyboard)
  keyboardStore.import(keyboard)
  console.log(keyboardStore)
  if (keyboardStore.pogConfigured) {
    router.push('/configurator')
    // also save to history
    addToHistory(keyboardStore)
  } else {
    router.push('/setup-wizard')
  }
}

const selectKeyboard = async (keyboard) => {
  const isSerial = serialKeyboards.value.find((a) => a.id === keyboard.id && !a.driveMounted)
  if (isSerial || !keyboard.path) {
    console.log('connectiong keyboard via serial')
    window.api.selectKeyboard({ id: keyboard.id })
  } else {
    const keyboardData = await window.api.selectKeyboard({ path: keyboard.path })
    console.log('connecting to keyboard via files')
    if (keyboardData.error) {
      if (keyboardData.error === 'pathNotFound') {
        console.log('keyboard is not connected')
        notifications.value.push({ label: 'Keyboard not connected' })
      }
      return
    }
    keyboardStore.import(keyboardData)
    router.push('/configurator')
  }
}

const removeFromHistory = (keyboard) => {
  keyboardHistory.value = keyboardHistory.value.filter((board) => board.id !== keyboard.id)
}

const keyboards = ref<any[]>([])
keyboardHistory.value.forEach((keyb) => {
  const keyboard = new KeyboardStore()
  keyboard.import({
    configContents: keyb,
    path: keyb.path,
    folderContents: ['pog.json'],
    codeContents: ''
  })
  keyboards.value.push(keyboard)
})


onMounted(() => {
  window.api.rescanKeyboards()
})
</script>

<style lang="scss" scoped>
.keyboard-list {
  @apply mx-auto mt-2 gap-2 pb-2;
  max-width: 700px;
}
.keyboard-preview {
  @apply flex cursor-pointer gap-4 rounded border border-white border-opacity-0 p-4 transition-all;
  &:hover {
    @apply border-opacity-40 bg-base-200;
  }
  .image {
    @apply flex flex-shrink-0 items-center justify-center rounded;
    width: 350px;
    height: 130px;
    border: 1px solid #333;
  }
}
</style>
