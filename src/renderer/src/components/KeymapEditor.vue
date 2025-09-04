<template>
  <div class="relative">
    <!--    <h2 class="mb-2 inline-block absolute top-6" style="transform: rotate(-90deg);  left: -15px">Layers</h2>-->
    <div class="mb-2 flex gap-2">
      <button class="btn btn-sm" @click="addLayer"><i class="mdi mdi-plus"></i>add Layer</button>
      <button class="btn btn-sm" :disabled="keyboardStore.keymap.length === 1" @click="removeLayer">
        <i class="mdi mdi-trash-can"></i>remove Layer
      </button>
      <button class="btn btn-sm" @click="duplicateLayer">
        <i class="mdi mdi-content-duplicate"></i>Duplicate Layer
      </button>
      <button class="btn btn-sm" @click="toggleSettings">
        <i class="mdi mdi-cog"></i>
      </button>
    </div>
    <div v-if="settingsOpen" class="mb-4 flex gap-2">
      <label class="flex items-center gap-2">
        <input v-model="userSettings.reduceKeymapColors" type="checkbox" class="checkbox" />
        <span>Reduce keymap colors</span>
      </label>
      <label class="flex items-center gap-2">
        <input v-model="userSettings.autoSelectNextKey" type="checkbox" class="checkbox" />
        <span>Auto-select next key</span>
      </label>
    </div>
    <div class="mt-4 flex items-center">
      <div class="flex gap-2">
        <KeymapLayer v-for="(layer, index) in keyboardStore.keymap" :layer="layer" :index="index" />
      </div>
    </div>
  </div>

  <div class="my-12">
    <keyboard-layout
      :key-layout="keyboardStore.keys"
      :keymap="keyboardStore.keymap"
      :matrix-width="keyboardStore.cols"
      :layouts="keyboardStore.layouts"
    />
  </div>
  <div class="my-4">
    <p class="mb-2 text-sm font-bold">
      Keycode Options for Selected Key(s)
      <span class="text-sm text-warning">{{ coordMapWarning }}</span>
    </p>
    <div class="flex gap-2">
      <select
        v-model="keycodeModeForSelection"
        class="select select-bordered select-sm"
        @change="switchedKeyCodeType"
      >
        <!-- simple will just inline the keycode -->
        <option value="simple">Simple</option>
        <!-- other options will create a separately linked keycode -->
        <option value="string">String</option>
        <option value="macro">Macro</option>
        <option value="tapdance">Tap Dance</option>
        <option value="custom">Custom</option>
      </select>
      <div class="flex-grow">
        <input
          v-model="currentKeyCode"
          :disabled="selectedKeys.size === 0"
          type="text"
          class="input input-bordered input-sm w-full"
        />
      </div>
    </div>
    <div v-if="keycodeModeForSelection === 'custom'" class="p-2 text-sm italic">
      <p>
        To add your own custom keycodes, edit the file `customkeys.py` to add your own and then use
        them with `customkeys.MyKey` in your keymap
      </p>
    </div>
  </div>
  <KeyPicker @setKey="setKey"></KeyPicker>
</template>

<script lang="ts" setup>
import { keyboardStore, selectedKeys, selectedLayer, userSettings } from '../store'
import KeyboardLayout from './KeyboardLayout.vue'
import KeyPicker from './KeyPicker.vue'
import { cleanupKeymap, selectNextKey } from '../helpers'
import { computed, ref } from 'vue'
import KeymapLayer from './KeymapLayer.vue'

selectedKeys.value.clear()

const keycodeModeForSelection = ref<
  'simple' | 'combo' | 'macro' | 'custom' | 'tapdance' | 'string'
>('simple')
const setKey = (keyCode: string) => {
  selectedKeys.value.forEach((index) => {
    keyboardStore.keys[index].setOnKeymap(keyCode)
  })
  // if one key is selected select the next
  // TODO: only select visible keys
  if (selectedKeys.value.size === 1 && userSettings.value.autoSelectNextKey) {
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
  if (keyboardStore.keymap.length <= 1) return

  // if needed also remove the encoder layer
  const encoderCount = keyboardStore.encoders.length
  if (encoderCount !== 0) {
    keyboardStore.encoderKeymap.splice(selectedLayer.value, 1)
  }
  keyboardStore.layers.splice(selectedLayer.value, 1)
  keyboardStore.keymap.splice(selectedLayer.value, 1)
  if (selectedLayer.value === keyboardStore.keymap.length - 1 && selectedLayer.value !== 0) {
    selectedLayer.value = keyboardStore.keymap.length - 2
  }
}
const duplicateLayer = () => {
  keyboardStore.keymap.push([...keyboardStore.keymap[selectedLayer.value]])
}
const currentKeyCode = computed({
  get() {
    const keys = keyboardStore.keys.filter((_k, index) => selectedKeys.value.has(index))
    if (keys.length === 0) return 'No key selected'
    const actions: string[] = []
    keys.forEach((key) => {
      actions.push(keyboardStore.getActionForKey({ key, layer: selectedLayer.value }))
    })

    return actions[0]
  },
  set(newVal) {
    if (newVal === '▽') return
    let setNewVal = newVal
    if (!newVal || selectedKeys.value.size === 0) {
      setNewVal = 'KC.TRNS'
    }
    const keys = keyboardStore.keys.filter((_k, index) => selectedKeys.value.has(index))
    keys.forEach((key) => {
      key.setOnKeymap(setNewVal)
    })
  }
})
const switchedKeyCodeType = () => {
  console.log(keycodeModeForSelection.value)
  const keys = keyboardStore.keys.filter((_k, index) => selectedKeys.value.has(index))
  keys.forEach((key) => {
    if (keycodeModeForSelection.value === 'macro') {
      key.setOnKeymap('KC.MACRO(Press(KC.LCTL),Tap(KC.A),Release(KC.LCTL))')
    } else if (keycodeModeForSelection.value === 'string') {
      key.setOnKeymap('KC.MACRO("Sample string")')
    } else if (keycodeModeForSelection.value === 'tapdance') {
      key.setOnKeymap('KC.TD(KC.A,KC.B)')
    } else if (keycodeModeForSelection.value === 'custom') {
      key.setOnKeymap('customkeys.MyKey')
    }
  })
}
const settingsOpen = ref(false)
const toggleSettings = () => {
  settingsOpen.value = !settingsOpen.value
}

const coordMapWarning = computed(() => {
  // show if any of the selected keys does not have and idx
  const keys = keyboardStore.keys.filter((_k, index) => selectedKeys.value.has(index))
  if (keys.length === 0) return ''
  console.log(keys, keys[0].coordMapIndex)
  if (keys.some((key) => typeof key.coordMapIndex !== 'number')) {
    return '⚠️ no coordmap index set in the layout for this key'
  }
  return ''
})
</script>
