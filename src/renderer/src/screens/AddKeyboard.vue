<template>
  <div class="btn" @click="$router.push('/')"><i class="mdi mdi-close"></i></div>
  <p>Create a Custom Keyboard firmware from scratch or choose a Keyboard from the community</p>
  <div>
    <button class="btn btn-primary" @click="selectDrive">from scratch</button>
    <button class="btn">Select a Keyboard</button>
  </div>
  <div>
    {{ keyboardStore.path }}
    {{ keyboardStore.keys.length }}
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from '../store'
import { useRouter } from 'vue-router'
const router = useRouter()
const selectDrive = async () => {
  const keyboard = await window.api.selectDrive()
  console.log(keyboard)
  keyboardStore.import(keyboard)
  console.log(keyboardStore)
  if (keyboardStore.pogConfigured) {
    router.push('/configurator/keymap')
  } else {
    router.push('/setup-wizard')
  }
}
</script>

<style lang="scss" scoped></style>
