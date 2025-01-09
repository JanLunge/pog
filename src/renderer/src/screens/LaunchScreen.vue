<template>
  <div class="flex flex-col p-4">
    <div class="flex items-center justify-between px-12">
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-2">
          <img src="../assets/icon.png" alt="" class="w-16" />
        </div>
        <div>
          <p class="text-2xl font-bold">Easy Keyboard Configurator</p>
          <p class="text-sm">Effortlessly customize your keyboard with Pog</p>
        </div>
      </div>
      <div class="my-4 flex flex-col items-center justify-center gap-2">
        <button class="btn btn-primary" @click="goToAddKeyboard">
          <i class="mdi mdi-plus mr-1 text-lg"></i><span class="text-xs">add keyboard</span>
        </button>
      </div>
    </div>
    <div v-if="sortedKeyboards.length !== 0" class="divider"></div>
    <div class="absolute right-2 top-40 flex justify-end">
      <button class="btn btn-sm" @click="refreshConnectedBoards">
        <i class="mdi mdi-refresh"></i>
      </button>
    </div>
    <TransitionGroup name="list" tag="ul" class="keyboard-list">
      <div
        v-for="keyboard in sortedKeyboards"
        :key="keyboard.id"
        class="keyboard-preview"
        :class="{
          'opacity-50': keyboard.path && !keyboard.driveConnected
        }"
        @click="selectKeyboard(keyboard)"
      >
        <div class="image">
          <div class="h-full w-full overflow-hidden p-2">
            <keyboard-layout
              v-if="keyboard.keys"
              :key-layout="keyboard.keys"
              :keymap="keyboard.keymap"
              :matrix-width="keyboard.cols"
              :layouts="keyboard.layouts"
              mode="static"
              :fixed-height="true"
            ></keyboard-layout>
          </div>
        </div>
        <div class="relative flex flex-grow flex-col pr-14">
          <p
            v-if="
              serialKeyboards.find(({ id, driveMounted }) => id === keyboard.id && !driveMounted)
            "
          >
            <span class="rounded bg-info p-1 text-xs"> Serial <span>BETA</span> </span>
          </p>
          <p v-else-if="keyboard.path">
            <span
              v-if="serialKeyboards.find((a) => a.id === keyboard.id)"
              class="mr-2 rounded bg-gray-600 p-1 text-xs"
            >
              Serial available
            </span>
            <span v-if="keyboard.driveConnected" class="rounded bg-accent p-1 text-xs"
              >USB Drive Mounted</span
            >
            <span v-else class="rounded bg-error p-1 text-xs">USB Drive Disconnected</span>
          </p>
          <p v-else><span class="rounded bg-error p-1 text-xs">Read Only Serial</span></p>
          <button
            class="btn btn-error btn-xs absolute right-5 top-0 opacity-50 hover:opacity-100"
            @click.stop="removeFromHistory(keyboard)"
          >
            <i class="mdi mdi-close"></i>
          </button>
          <p class="font-bold">{{ keyboard.name }}</p>
          <p class="text-sm italic">{{ keyboard.manufacturer }}</p>
          <p class="mt-2 text-xs italic">{{ keyboard.path }}</p>
          <p class="mt-2" style="font-size: 12px">{{ keyboard.description }}</p>
          <div class="mt-2">
            <div v-for="tag in keyboard.tags" :key="tag" class="badge badge-outline">
              {{ tag }}
            </div>
          </div>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import {
  keyboardStore,
  keyboardHistory,
  notifications,
  KeyboardStore,
  selectedLayer,
  serialKeyboards
} from '../store'
import KeyboardLayout from '../components/KeyboardLayout.vue'
import { computed, onMounted, ref, watch } from 'vue'
const router = useRouter()
selectedLayer.value = 0



const sortedKeyboards = computed(() => {
  return [...keyboards.value].sort((a, b) => {
    if (a.driveConnected && !b.driveConnected) return -1
    if (!a.driveConnected && b.driveConnected) return 1
    return 0
  })
})

const selectKeyboard = async (keyboard) => {
  const isSerial = serialKeyboards.value.find(
    ({ id, driveMounted }) => id === keyboard.id && !driveMounted
  )
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
    router.push('/configurator/keymap')
  }
}

const removeFromHistory = (keyboard) => {
  keyboardHistory.value = keyboardHistory.value.filter((board) => board.id !== keyboard.id)
  keyboards.value = keyboards.value.filter((board) => board.id !== keyboard.id)
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

const addSerialKeyboards = () => {
  serialKeyboards.value.forEach((board) => {
    if (!keyboards.value.find((a) => a.id === board.id)) {
      keyboards.value.unshift({
        id: board.id,
        port: board.port,
        name: board.name,
        description: board.description,
        manufacturer: board.manufacturer
      })
    } else {
      // update the port
      console.log('adding port to keyboard', board.id, board.port, board.serialNumber)
      // keyboards.value.find((a) => a.id === board.id).port = board.port
      // keyboards.value.find((a) => a.id === board.id).serialNumber = board.serialNumber
    }
  })
}

const checkForUSBKeyboards = () => {
  const keyboardPaths = keyboards.value.map((keyboard) => keyboard.path)
  console.log('requesting usb keyboards', keyboardPaths)
  window.api.checkForUSBKeyboards(keyboardPaths).then((keyboardConnections) => {
    keyboardConnections.forEach((keyboard) => {
      console.log(keyboard)
      if (keyboard.connected) {
        // set connected state in the keyboard list
        keyboards.value.find((a) => a.path === keyboard.path).driveConnected = true
      }
    })
  })
  console.log('updated kbs', keyboards.value)
}
watch(serialKeyboards, () => {
  addSerialKeyboards()
})

const refreshConnectedBoards = () => {
  checkForUSBKeyboards()
  addSerialKeyboards()
}

const goToAddKeyboard = () => {
  router.push('/keyboard-selector')
}

onMounted(() => {
  window.api.rescanKeyboards()
  // load the serial keyboards into the shown list
  addSerialKeyboards()
  checkForUSBKeyboards()
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
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
