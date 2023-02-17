<template>
  <div class="flex flex-col p-4">
    <div class="flex flex-col items-center">
      <div class="flex gap-2 items-center">
        <img src="../assets/icon.png" alt="" class="w-16" />
      </div>
      <p class="pt-6">Effortlessly customize your keyboard with Pog</p>
    </div>
    <div class="text-2xl font-bold">Your Keyboards</div>
    <div class="divider"></div>
    <div class="my-4 flex justify-center">
      <button class="btn btn-primary" @click="selectDrive">
        <i class="mdi mdi-plus text-lg mr-1"></i><span class="text-xs">add new keyboard</span>
      </button>
    </div>
    <div class="text-center italic opacity-50">
      (Note: your controller needs to be running
      <a href="https://circuitpython.org/downloads" target="_blank" class="link">circuit python</a>)
    </div>
    <div class="">
      <div class="keyboard-list">
        <div v-for="keyboard in keyboardHistory" :key="keyboard.id" class="keyboard-preview" @click="selectKeyboard(keyboard.path)">
          <div class="image">
            <img :src="keyboard.image" alt="" />
          </div>
          <div class="flex-grow flex flex-col justify-center">
            <p class="font-bold">{{ keyboard.name }}</p>
            <p class="mt-2 italic mt-2">{{ keyboard.path }}</p>
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
import { ref } from 'vue'
import { ulid } from 'ulid'
import { useRouter } from 'vue-router'
import {keyboardStore, keyboardHistory} from "../store";
const router = useRouter()
//
// const keyboardHistory = ref<
//   {
//     id: string
//     name: string
//     description: string
//     image: string
//     path: string
//     tags: { label: string; color: string; category: 'formfactor' }[]
//   }[]
// >([])
//
// keyboardHistory.value.push({
//   id: ulid(),
//   name: '0xCB New Horizons',
//   description: '65% keyboard with rotary encoder',
//   path: '/Volumes/Helios',
//   image: '',
//   tags: [{ category: 'formfactor', label: '65%', color: '#399453' }]
// })

const addKeyboard = () => {
  router.push('/add-keyboard')
}
const selectDrive = async () => {
  const keyboard = await window.api.selectDrive()
  console.log(keyboard)
  keyboardStore.import(keyboard)
  console.log(keyboardStore)
  if (keyboardStore.pogConfigured) {
    router.push('/configurator')
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
</script>

<style lang="scss" scoped>
.keyboard-list {
  @apply gap-2 pb-2 mt-2 mx-auto;
  max-width: 700px;
}
.keyboard-preview {
  @apply flex gap-4 p-4 rounded transition-all cursor-pointer border border-white border-opacity-0;
  &:hover {
    @apply bg-base-300 border-opacity-40;
  }
  .image {
    @apply rounded flex items-center justify-center;
    width: 250px;
    height: 130px;
    border: 1px solid #333;
  }
}
</style>
