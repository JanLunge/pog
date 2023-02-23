<template>
  <div class="flex gap-2">
    <div class="btn-sm btn mb-4 p-2" @click="showConverter">
      <i class="mdi mdi-import"></i>Import from KLE
    </div>
    <div class="btn-sm btn mb-4 p-2" @click="showRawPogOutput">
      <i class="mdi mdi-export"></i>export from pog
    </div>
  </div>
  <div v-if="converterVisible">
    <div class="flex gap-2">
      <div class="text-left">
        <p>
          you can import json files from the
          <a class="link" href="http://keyboard-layout-editor.com" target="_blank"
            >keyboard layout editor</a
          >
        </p>
        <p>set the top left label to the matrix position eg '0,1' for row:0 col:1</p>
        <p>
          set the bottom right label for a layout variant<br />
          eg. '0,1' this would be the first layout option using its other variant
        </p>
      </div>
      <div class="flex items-center justify-center">
        <img src="@renderer/assets/kle.png" class="rounded" style="width: 300px" />
      </div>
    </div>
    <div class="mt-4 flex gap-2">
      <textarea
        v-model="kleInput"
        class="textarea-bordered textarea w-full"
        style="line-height: 1rem"
        rows="8"
      ></textarea>
    </div>
    <div class="mt-2 flex flex-col gap-2">
      <span class="text-warning">this will overwrite your existing layout</span>
      <button class="btn-primary btn-sm btn my-4" @click="convert">convert to pog.json</button>
    </div>
    <hr />
  </div>
  <div v-if="showRawPogLayout">
    <textarea v-model="pogOutput" class="textarea-bordered textarea w-full"></textarea>
  </div>
  <div>
    <div class="flex justify-between">
      <div class="flex gap-1">
        <button class="btn-primary btn-sm btn" @click="addKey">
          <i class="mdi mdi-plus"></i>add key
        </button>
        <button
          class="btn-primary btn-sm btn"
          :disabled="selectedKeys.size === 0"
          @click="removeKey"
        >
          <i class="mdi mdi-trash-can"></i>remove key
        </button>
      </div>
    </div>

    <keyboard-layout
      :key-layout="keyboardStore.keys"
      :keymap="keyboardStore.keymap"
      :matrix-width="keyboardStore.cols"
      :layouts="keyboardStore.layouts"
      mode="layout"
    />
    <div class="flex">
      <div class="w-1/2 border-r">
        <variant-switcher></variant-switcher>
      </div>
      <div class="w-1/2 pl-2">
        <key-layout-info :layout="keyboardStore.keys"></key-layout-info>
      </div>
    </div>
    <div v-if="initialSetup" class="btn-primary btn" @click="setupDone">Finish Setup</div>
  </div>
</template>

<script lang="ts" setup>
import { cleanupKeymap, KleToPog, selectNextKey, selectPrevKey } from '../helpers'
import { onMounted, ref } from 'vue'
import { selectedKeys, keyboardStore, Key, addToHistory } from '../store'
import KeyboardLayout from './KeyboardLayout.vue'
import { isNumber, onKeyStroke } from '@vueuse/core'
import KeyLayoutInfo from './KeyLayoutInfo.vue'
import VariantSwitcher from './VariantSwitcher.vue'
// import { useRouter } from 'vue-router'

// const router = useRouter()
const kleInput = ref('')
const showRawPogLayout = ref(false)
const pogOutput = ref('')
selectedKeys.value.clear()
const emit = defineEmits(['next'])
const props = defineProps(['initialSetup'])
const converterVisible = ref(false)
const showConverter = () => {
  converterVisible.value = !converterVisible.value
}
const showRawPogOutput = () => {
  showRawPogLayout.value = !showRawPogLayout.value
  // export
  pogOutput.value = JSON.stringify(keyboardStore.getKeys(), null, 4)
}
const convert = () => {
  const layout = KleToPog(kleInput.value)
  // const pogOutput = JSON.stringify(layout, null, 4)
  // extract variants
  console.log('checking for variants', layout)
  if (props.initialSetup) {
    // selectedConfig.value.layouts = layout,
    layout.forEach((key) => {
      console.log(key)
      if (key.variant && isNumber(key.variant[0])) {
        // check if variant exists
        console.log('checking key for variant', key.variant)
        if (!keyboardStore.layouts[key.variant[0]]) {
          // if not create it
          keyboardStore.layouts[key.variant[0]] = {
            name: `Variant ${key.variant[0]}`,
            selected: 0,
            variants: []
          }
        }
      }
    })
    // create default keymap
    console.log('setting layout', layout)
    keyboardStore.setKeys(layout)
    cleanupKeymap()
    // saveKeymap()
  }
  if (layout.length > 0) {
    converterVisible.value = false
  }
}
const setupDone = () => {
  // if (!selectedConfig.value) return
  // if (!selectedConfig.value.layouts) selectedConfig.value.layouts = { keymap: [], labels: [] }
  // selectedConfig.value.layouts.keymap = tmpLayout.value;
  // save
  window.api.saveConfiguration(
    JSON.stringify({ pogConfig: keyboardStore.serialize(), writeFirmware: false })
  )
  // save config to localstorage
  addToHistory(keyboardStore)

  emit('next')
}

// const saveKeymap = async () => {
//   // const data = {
//   //   rowPins: selectedKeyboard.value.configContents.pins.rows,
//   //   colPins: selectedKeyboard.value.configContents.pins.cols,
//   //   keymap: keymap.value,
//   //   diodeDirection: selectedKeyboard.value.configContents.matrix.diodeDirection,
//   //   config: selectedKeyboard.value
//   // }
//   const data = keyboardStore.serialize()
//   console.log(data)
//   // save to pog.json
//   // const saveResponse = await window.api.saveKeymap(JSON.stringify(data))
// }

const addKey = () => {
  // add key to the last position (+ keywidth ) + 1
  // basically just to not have them overlap
  if (keyboardStore.keys.length === 0) {
    keyboardStore.addKey({
      x: 0,
      y: 0,
      matrix: []
    })
  } else {
    let lastKey = new Key({
      x: 0,
      y: 0,
      // matrix: [],
      w: 1
    })
    keyboardStore.keys.forEach((key) => {
      if (lastKey.y < key.y) lastKey = key
      if (lastKey.y === key.y && lastKey.x < key.x) lastKey = key
    })
    keyboardStore.addKey({
      x: lastKey.x + (lastKey.w || 1),
      y: lastKey.y,
      matrix: []
    })
  }
}

const removeKey = () => {
  const keys = [...selectedKeys.value].map((key) => keyboardStore.keys[key].id)
  keyboardStore.removeKeys({ ids: keys })
  selectedKeys.value.clear()
}

onMounted(() => {
  // move keys with arrows

  onKeyStroke('ArrowDown', (e: KeyboardEvent) => {
    e.preventDefault()
    if (e.shiftKey) {
      // set key width
      keyboardStore.deltaForKeys({
        keyIndexes: [...selectedKeys.value],
        value: 0.25,
        property: 'h'
      })
      return
    }
    keyboardStore.deltaForKeys({ keyIndexes: [...selectedKeys.value], value: 0.25, property: 'y' })
  })
  onKeyStroke('ArrowUp', (e: KeyboardEvent) => {
    e.preventDefault()
    if (e.shiftKey) {
      // set key width
      keyboardStore.deltaForKeys({
        keyIndexes: [...selectedKeys.value],
        value: -0.25,
        property: 'h'
      })
      return
    }
    keyboardStore.deltaForKeys({ keyIndexes: [...selectedKeys.value], value: -0.25, property: 'y' })
  })
  onKeyStroke('ArrowLeft', (e: KeyboardEvent) => {
    e.preventDefault()
    if (e.altKey && selectedKeys.value.size === 1) {
      // alt select next key
      selectPrevKey()
      return
    }
    if (e.shiftKey) {
      // set key width
      keyboardStore.deltaForKeys({
        keyIndexes: [...selectedKeys.value],
        value: -0.25,
        property: 'w'
      })
      return
    }
    keyboardStore.deltaForKeys({ keyIndexes: [...selectedKeys.value], value: -0.25, property: 'x' })
  })
  onKeyStroke('ArrowRight', (e: KeyboardEvent) => {
    e.preventDefault()
    if (e.altKey && [...selectedKeys.value].length === 1) {
      // alt select next key
      selectNextKey()
      return
    }
    if (e.shiftKey) {
      // set key width
      keyboardStore.deltaForKeys({
        keyIndexes: [...selectedKeys.value],
        value: 0.25,
        property: 'w'
      })
      return
    }
    keyboardStore.deltaForKeys({ keyIndexes: [...selectedKeys.value], value: 0.25, property: 'x' })
  })
})
//
// const hasSelectedKeys = computed(() => {
//   return selectedKeys.value.size
// })
</script>

<style lang="scss" scoped></style>
