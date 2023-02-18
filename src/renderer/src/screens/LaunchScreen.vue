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
    <div class="my-4 flex justify-center">
      <button class="btn-primary btn" @click="selectDrive">
        <i class="mdi mdi-plus mr-1 text-lg"></i><span class="text-xs">add new keyboard</span>
      </button>
    </div>
    <div class="text-center italic opacity-50">
      (Note: your controller needs to be running
      <a href="https://circuitpython.org/downloads" target="_blank" class="link">circuit python</a>)
    </div>
    <div class="">
      <div class="keyboard-list">
        <div
          v-for="keyboard in keyboardHistory"
          :key="keyboard.id"
          class="keyboard-preview"
          @click="selectKeyboard(keyboard.path)"
        >
          <div class="image">
            <img :src="keyboard.image" alt="" />
          </div>
          <div class="relative flex flex-grow flex-col justify-center">
            <button
              class="btn-ghost btn-sm btn absolute top-0 right-0"
              @click.stop="removeFromHistory(keyboard)"
            >
              <i class="mdi mdi-close"></i>
            </button>
            <p class="font-bold">{{ keyboard.name }}</p>
            <p class="mt-2 mt-2 italic">{{ keyboard.path }}</p>
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
import { keyboardStore, keyboardHistory } from '../store'
const router = useRouter()

const selectDrive = async () => {
  const keyboard = await window.api.selectDrive()
  console.log(keyboard)
  keyboardStore.import(keyboard)
  console.log(keyboardStore)
  if (keyboardStore.pogConfigured) {
    router.push('/configurator')
    // also save to history
    keyboardHistory.value.unshift({
      path: keyboardStore.path,
      id: keyboardStore.id,
      name: keyboardStore.name,
      tags: keyboardStore.tags
    })
  } else {
    router.push('/setup-wizard')
  }
}
const selectKeyboard = async (keyboardPath) => {
  const keyboard = await window.api.selectKeyboard(keyboardPath)
  console.log(keyboard)
  keyboardStore.import(keyboard)
  router.push('/configurator')
}

const removeFromHistory = (keyboard) => {
  keyboardHistory.value = keyboardHistory.value.filter((board) => board.id !== keyboard.id)
}
</script>

<style lang="scss" scoped>
.keyboard-list {
  @apply mx-auto mt-2 gap-2 pb-2;
  max-width: 700px;
}
.keyboard-preview {
  @apply flex cursor-pointer gap-4 rounded border border-white border-opacity-0 p-4 transition-all;
  &:hover {
    @apply border-opacity-40 bg-base-300;
  }
  .image {
    @apply flex items-center justify-center rounded;
    width: 250px;
    height: 130px;
    border: 1px solid #333;
  }
}
</style>
