<template>
  <div class="relative">
    <!--    <h2 class="mb-2 inline-block absolute top-6" style="transform: rotate(-90deg);  left: -15px">Layers</h2>-->
    <div class="mb-2 flex gap-2">
      <button class="btn-primary btn-sm btn" @click="addLayer">
        <i class="mdi mdi-plus"></i>add Layer
      </button>
      <button
        class="btn-primary btn-sm btn"
        :disabled="keyboardStore.keymap.length === 1"
        @click="removeLayer"
      >
        <i class="mdi mdi-trash-can"></i>remove Layer
      </button>
    </div>
    <div class="flex items-center">
      <div class="flex gap-2">
        <div
          v-for="(_layer, index) in keyboardStore.keymap"
          class="tab"
          :class="{ 'tab-active': index === selectedLayer }"
          @click="selectedLayer = index"
        >
          {{ index }}
        </div>
      </div>
    </div>
  </div>
  <keyboard-layout :key-layout="keyboardStore.keys" />
  <div v-if="selectedKeys.size !== 0" class="my-4">
    <p>Keycode Options for Selected Key(s)</p>
    <div class="flex gap-2">
      <select v-model="keycodeModeForSelection" class="select-bordered select">
        <!-- simple will just inline the keycode -->
        <option value="simple">simple</option>
        <!-- other options will create a separately linked keycode -->
        <option value="sequence">sequence</option>
        <option value="tapdance">tapdance</option>
        <option value="combo">combo</option>
        <option value="custom">custom</option>
      </select>
      <div>
        <div v-if="keycodeModeForSelection === 'simple'">
          select a key from the picker below to change it
        </div>
        <div v-if="keycodeModeForSelection !== 'simple'">
          <span>set custom keycode</span>
          <input v-model="tmpKeycode" type="text" class="input-bordered input" />
        </div>
      </div>
    </div>
  </div>
  <KeyPicker @setKey="setKey"></KeyPicker>
</template>

<script lang="ts" setup>
import { keyboardStore, selectedKeys, selectedLayer } from '../store'
import KeyboardLayout from './KeyboardLayout.vue'
import KeyPicker from './KeyPicker.vue'
import { cleanupKeymap, selectNextKey } from '../helpers'
import { ref } from 'vue'

const tmpKeycode = ref('')
selectedKeys.value.clear()

const keycodeModeForSelection = ref<'simple' | 'combo' | 'sequence' | 'custom' | 'tapdance'>(
  'simple'
)
const setKey = (keyCode: string) => {
  selectedKeys.value.forEach((index) => {
    keyboardStore.keys[index].setOnKeymap(keyCode)
  })
  // if one key is selected select the next
  // TODO: only select visible keys
  if (selectedKeys.value.size === 1) {
    selectNextKey()
  }
}
cleanupKeymap()
const addLayer = () => {
  if (!keyboardStore.keymap[0]) {
    keyboardStore.keymap.push(Array(keyboardStore.cols * keyboardStore.rows).fill('KC.TRNS'))
  }
  const tmpKeymap = [...keyboardStore.keymap[0]]
  tmpKeymap.fill('KC.TRNS')
  keyboardStore.keymap.push(tmpKeymap)
  // if needed also add an encoder layer
  const encoderCount = keyboardStore.encoders.length
  if (encoderCount !== 0) {
    keyboardStore.encoderKeymap.push(Array(encoderCount).fill(['KC.TRNS', 'KC.TRNS']))
  }
}
const removeLayer = () => {
  if (selectedLayer.value === keyboardStore.keymap.length - 1 && selectedLayer.value !== 0) {
    selectedLayer.value = keyboardStore.keymap.length - 2
  }
  if (keyboardStore.keymap.length <= 1) return

  keyboardStore.keymap.splice(selectedLayer.value, 1)
  // if needed also remove the encoder layer
  const encoderCount = keyboardStore.encoders.length
  if (encoderCount !== 0) {
    keyboardStore.encoderKeymap.splice(selectedLayer.value, 1)
  }
}
</script>

<style lang="scss" scoped>
.tab {
  @apply rounded;
  background: #434343;
}
.tab-active {
  @apply bg-primary font-bold text-black;
}
</style>
