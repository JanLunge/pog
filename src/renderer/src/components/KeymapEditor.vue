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
        <KeymapLayer
          v-for="(layer, index) in keyboardStore.keymap"
          :key="index"
          :layer="layer"
          :index="index"
        />
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
      <div class="flex-grow">
        <input
          v-model="currentKeyCode"
          :disabled="selectedKeys.size === 0"
          type="text"
          class="input input-bordered input-sm w-full"
        />
      </div>
      <button v-if="selectedKeys.size > 0" class="btn btn-primary btn-sm" @click="openMacroModal">
        Custom Macro
      </button>
      <!-- Templates Dropdown with Floating UI -->
      <div v-if="selectedKeys.size > 0" class="relative">
        <button ref="templatesButtonRef" class="btn btn-sm" @click="toggleTemplatesDropdown">
          <i class="mdi mdi-file-document-outline mr-1"></i>Templates
          <i class="mdi mdi-chevron-down ml-1"></i>
        </button>
        <Teleport to="body">
          <div
            v-if="templatesDropdownOpen"
            class="fixed inset-0 z-40"
            @click="closeTemplatesDropdown"
          ></div>
          <ul
            v-if="templatesDropdownOpen"
            ref="templatesDropdownRef"
            :style="floatingStyles"
            class="menu rounded-box z-50 w-52 bg-base-300 p-2 shadow-lg"
          >
            <li class="menu-title"><span>Insert Template</span></li>
            <li>
              <a @click="insertTemplate('macro'), closeTemplatesDropdown()"
                ><i class="mdi mdi-keyboard"></i> Macro</a
              >
            </li>
            <li>
              <a @click="insertTemplate('string'), closeTemplatesDropdown()"
                ><i class="mdi mdi-format-text"></i> String</a
              >
            </li>
            <li>
              <a @click="insertTemplate('tapdance'), closeTemplatesDropdown()"
                ><i class="mdi mdi-gesture-double-tap"></i> Tap Dance</a
              >
            </li>
            <li>
              <a @click="insertTemplate('custom'), closeTemplatesDropdown()"
                ><i class="mdi mdi-cog"></i> Custom Key</a
              >
            </li>
            <li class="my-1 h-px bg-base-content/20"></li>
            <li class="menu-title"><span>Documentation</span></li>
            <li>
              <a
                href="https://github.com/KMKfw/kmk_firmware/blob/main/docs/en/macros.md"
                target="_blank"
              >
                <i class="mdi mdi-open-in-new"></i> Macros Guide
              </a>
            </li>
            <li>
              <a
                href="https://github.com/KMKfw/kmk_firmware/blob/main/docs/en/tapdance.md"
                target="_blank"
              >
                <i class="mdi mdi-open-in-new"></i> Tap Dance Guide
              </a>
            </li>
            <li>
              <a
                href="https://github.com/KMKfw/kmk_firmware/blob/main/docs/en/keycodes.md"
                target="_blank"
              >
                <i class="mdi mdi-open-in-new"></i> Keycodes Reference
              </a>
            </li>
            <li>
              <a
                href="https://github.com/KMKfw/kmk_firmware/blob/main/docs/en/layers.md"
                target="_blank"
              >
                <i class="mdi mdi-open-in-new"></i> Layers Guide
              </a>
            </li>
          </ul>
        </Teleport>
      </div>
    </div>
    <div v-if="keycodeModeForSelection === 'custom'" class="p-2 text-sm italic">
      <p>
        To add your own custom keycodes, edit the file `customkeys.py` to add your own and then use
        them with `customkeys.MyKey` in your keymap
      </p>
    </div>
  </div>
  <KeyPicker :show-secondary="true" @set-key="setKey"></KeyPicker>

  <!-- Macro Modal -->
  <MacroModal
    :is-open="macroModal.isOpen"
    :initial-macro-code="macroModal.initialCode"
    @close="closeMacroModal"
    @apply="applyMacroCode"
  />
</template>

<script lang="ts" setup>
import { keyboardStore, selectedKeys, selectedLayer, userSettings } from '../store'
import KeyboardLayout from './KeyboardLayout.vue'
import KeyPicker from './KeyPicker.vue'
import MacroModal from './MacroModal.vue'
import { cleanupKeymap, selectNextKey } from '../helpers'
import { computed, ref, watch } from 'vue'
import KeymapLayer from './KeymapLayer.vue'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'

selectedKeys.value.clear()

type KeycodeMode = 'simple' | 'combo' | 'macro' | 'custom' | 'tapdance' | 'string'

const keycodeModeForSelection = ref<KeycodeMode>('simple')

const detectKeycodeType = (keycode: string): KeycodeMode => {
  if (!keycode || keycode === 'No key selected' || keycode === '▽') return 'simple'
  if (keycode.includes('KC.MACRO("') || keycode.includes("KC.MACRO('")) return 'string'
  if (keycode.includes('KC.MACRO(')) return 'macro'
  if (keycode.includes('KC.TD(')) return 'tapdance'
  if (keycode.includes('customkeys.')) return 'custom'
  if (keycode.includes('KC.COMBO(')) return 'combo'
  return 'simple'
}
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
const insertTemplate = (templateType: KeycodeMode) => {
  const keys = keyboardStore.keys.filter((_k, index) => selectedKeys.value.has(index))
  keys.forEach((key) => {
    if (templateType === 'macro') {
      key.setOnKeymap('KC.MACRO(Press(KC.LCTL),Tap(KC.A),Release(KC.LCTL))')
    } else if (templateType === 'string') {
      key.setOnKeymap('KC.MACRO("Sample string")')
    } else if (templateType === 'tapdance') {
      key.setOnKeymap('KC.TD(KC.A,KC.B)')
    } else if (templateType === 'custom') {
      key.setOnKeymap('customkeys.MyKey')
    }
  })
}
const settingsOpen = ref(false)
const toggleSettings = () => {
  settingsOpen.value = !settingsOpen.value
}

// Floating UI for Templates dropdown
const templatesButtonRef = ref<HTMLElement | null>(null)
const templatesDropdownRef = ref<HTMLElement | null>(null)
const templatesDropdownOpen = ref(false)

const { floatingStyles } = useFloating(templatesButtonRef, templatesDropdownRef, {
  placement: 'bottom-end',
  middleware: [offset(4), flip(), shift({ padding: 8 })],
  whileElementsMounted: autoUpdate
})

const toggleTemplatesDropdown = () => {
  templatesDropdownOpen.value = !templatesDropdownOpen.value
}

const closeTemplatesDropdown = () => {
  templatesDropdownOpen.value = false
}

const macroModal = ref({
  isOpen: false,
  initialCode: ''
})

const openMacroModal = () => {
  macroModal.value = { isOpen: true, initialCode: currentKeyCode.value }
}

const closeMacroModal = () => {
  macroModal.value.isOpen = false
}

const applyMacroCode = (macroCode: string) => {
  currentKeyCode.value = macroCode
  closeMacroModal()
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

watch(
  () => currentKeyCode.value,
  (newKeyCode) => {
    if (newKeyCode && newKeyCode !== 'No key selected') {
      const detectedType = detectKeycodeType(newKeyCode)
      keycodeModeForSelection.value = detectedType
    }
  },
  { immediate: true }
)
</script>
