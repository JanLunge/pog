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
      <button
        class="btn-primary btn-sm btn"
        @click="duplicateLayer"
      >
        <i class="mdi mdi-content-duplicate"></i>Duplicate Layer
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
  <div style="max-height: 300px" class="my-5">

  <keyboard-layout
    :key-layout="keyboardStore.keys"
    :keymap="keyboardStore.keymap"
    :matrix-width="keyboardStore.cols"
    :layouts="keyboardStore.layouts"
  />

  </div>
  <div class="my-4">
    <p class="mb-2 text-sm font-bold">Keycode Options for Selected Key(s)</p>
    <div class="flex gap-2">
      <select
        v-model="keycodeModeForSelection"
        class="select-bordered select select-sm"
        @change="switchedKeyCodeType"
      >
        <!-- simple will just inline the keycode -->
        <option value="simple">simple</option>
        <!-- other options will create a separately linked keycode -->
        <option value="string">string</option>
        <option value="sequence">sequence</option>
        <option value="tapdance">tapdance</option>
        <option value="custom">custom</option>
      </select>
      <div class="flex-grow">
        <input :disabled="selectedKeys.size === 0" v-model="currentKeyCode" type="text" class="input-bordered input input-sm w-full" />
      </div>
    </div>
    <div v-if="keycodeModeForSelection === 'custom'" class="p-2 text-sm italic">
      <p>to add your own custom keycodes you edit the file `customkeys.py` to add your own and then use them with cusomkeys.MyKey in your keymap</p>
    </div>
  </div>
  <KeyPicker @setKey="setKey"></KeyPicker>
</template>

<script lang="ts" setup>
import { keyboardStore, selectedKeys, selectedLayer } from '../store'
import KeyboardLayout from './KeyboardLayout.vue'
import KeyPicker from './KeyPicker.vue'
import { cleanupKeymap, selectNextKey } from '../helpers'
import { computed, ref } from 'vue'

selectedKeys.value.clear()

const keycodeModeForSelection = ref<'simple' | 'combo' | 'sequence' | 'custom' | 'tapdance' | 'string'>(
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
const duplicateLayer = () => {
  keyboardStore.keymap.push([...keyboardStore.keymap[selectedLayer.value]])
}
const currentKeyCode = computed({
  get() {
    const keys = keyboardStore.keys.filter((_k, index) => selectedKeys.value.has(index))
    if (keys.length === 0) return 'no key'
    const actions: string[] = []
    keys.forEach((key) => {
      actions.push(keyboardStore.getActionForKey({ key, layer: selectedLayer.value }))
    })

    return actions[0]
  },
  set(newVal) {
    if(newVal === "▽") return
    if(selectedKeys.value.size === 0 ) return
    const keys = keyboardStore.keys.filter((_k, index) => selectedKeys.value.has(index))
    keys.forEach((key) => {
      key.setOnKeymap(newVal)
    })
  }
})
const switchedKeyCodeType = () => {
  console.log(keycodeModeForSelection.value)
  const keys = keyboardStore.keys.filter((_k, index) => selectedKeys.value.has(index))
  keys.forEach((key) => {
    if (keycodeModeForSelection.value === 'sequence') {
      key.setOnKeymap('simple_key_sequence((KC.A, KC.B))')
    } else if (keycodeModeForSelection.value === 'string') {
      key.setOnKeymap('send_string("")')
    }else if(keycodeModeForSelection.value === 'tapdance'){
      key.setOnKeymap('KC.TD(KC.A,KC.B)')
    }else if(keycodeModeForSelection.value === 'custom'){
      key.setOnKeymap('customkeys.MyKey')
    }
  })
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
