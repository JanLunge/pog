<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div
        class="relative max-h-[90vh] w-11/12 max-w-6xl overflow-y-auto rounded-2xl border border-gray-200/20 bg-base-100/80 p-8 shadow-2xl backdrop-blur-md"
      >
        <h3 class="mb-6 text-2xl font-semibold">Custom macro builder</h3>

        <!-- Parse Error -->
        <div v-if="parseError" class="mb-4 rounded-lg bg-error/20 p-4 text-error">
          <div class="font-semibold">Parse Error:</div>
          <div class="text-sm">{{ parseError }}</div>
        </div>

        <div class="mb-6">
          <label class="label">
            <span class="label-text font-semibold">Number of keys:</span>
          </label>
          <div class="flex gap-2">
            <button
              v-for="num in [2, 3, 4]"
              :key="num"
              :class="['btn btn-sm', selectedKeyCount === num ? 'btn-primary' : 'btn-outline']"
              @click="selectKeyCount(num)"
            >
              {{ num }} keys
            </button>
          </div>
        </div>

        <div v-if="selectedKeyCount > 0" class="my-8">
          <div class="flex items-center justify-center gap-6">
            <template v-for="(_, index) in selectedKeyCount" :key="index">
              <div class="flex flex-col items-center gap-3">
                <div
                  class="flex h-20 w-28 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-all duration-200"
                  :class="getKeyBoxClass(index)"
                  @click="selectKeyForIndex(index)"
                >
                  <div v-if="macroKeys[index]?.keycode" class="text-center text-sm font-bold">
                    {{ macroKeys[index].keycode }}
                  </div>
                  <div v-else class="text-sm text-gray-400">Key {{ index + 1 }}</div>
                </div>
              </div>
              <div v-if="index < selectedKeyCount - 1" class="mx-2 text-3xl font-bold text-primary">
                +
              </div>
            </template>
          </div>
        </div>

        <div v-if="selectedKeyCount > 0" class="mt-6">
          <KeyPicker :show-secondary="false" @set-key="setKeycodeForCurrentKey" />
        </div>

        <div class="mt-8 flex items-center justify-end gap-3">
          <button class="btn" @click="closeModal">Cancel</button>
          <button class="btn btn-primary" :disabled="!isValidMacro" @click="applyMacro">
            Apply
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'
import KeyPicker from './KeyPicker.vue'

interface MacroKey {
  keyId: string
  keycode: string
}

const props = defineProps<{
  isOpen: boolean
  initialMacroCode?: string
}>()

const emit = defineEmits(['close', 'apply'])

const selectedKeyCount = ref(0)
const macroKeys = ref<MacroKey[]>([])
const currentSelectedKeyIndex = ref<number | null>(null)
const parseError = ref('')

const isValidMacro = computed(() => {
  return selectedKeyCount.value > 0 && macroKeys.value.every((key) => key.keycode.trim())
})

const getKeyBoxClass = (index: number) => {
  const isSelected = currentSelectedKeyIndex.value === index
  const hasKeycode = macroKeys.value[index]?.keycode

  if (isSelected) return 'border-primary bg-primary/20 shadow-lg'
  if (hasKeycode) return 'border-primary bg-primary/10'
  return 'border-gray-400 hover:border-primary hover:bg-primary/5'
}

const selectKeyCount = (count: number) => {
  selectedKeyCount.value = count
  macroKeys.value = Array(count)
    .fill(null)
    .map(() => ({ keyId: '', keycode: '' }))
  currentSelectedKeyIndex.value = 0
}

const selectKeyForIndex = (index: number) => {
  currentSelectedKeyIndex.value = index
}

const setKeycodeForCurrentKey = (keycode: string) => {
  const currentIndex = currentSelectedKeyIndex.value
  if (currentIndex !== null) {
    macroKeys.value[currentIndex].keycode = keycode
    // Auto move to next key (sequential, not just empty ones)
    const nextIndex = currentIndex + 1
    if (nextIndex < selectedKeyCount.value) {
      // Move to next key
      currentSelectedKeyIndex.value = nextIndex
    } else {
      // All keys filled, deselect
      currentSelectedKeyIndex.value = null
    }
  }
}

const closeModal = () => {
  resetState()
  emit('close')
}

const generateMacroCode = () => {
  const validKeys = macroKeys.value.filter((key) => key.keycode.trim())
  const pressKeys = validKeys.map((key) => `Press(${key.keycode})`)
  const releaseKeys = validKeys
    .slice()
    .reverse()
    .map((key) => `Release(${key.keycode})`)
  return `KC.MACRO(${[...pressKeys, ...releaseKeys].join(',')})`
}

const applyMacro = () => {
  if (isValidMacro.value) {
    emit('apply', generateMacroCode())
    closeModal()
  }
}

const parseExistingMacro = (macroCode: string) => {
  parseError.value = ''
  resetState()

  if (!macroCode || macroCode === 'No key selected' || macroCode === '▽') return
  if (!macroCode.includes('KC.MACRO(')) {
    parseError.value = 'Not a valid macro code'
    return
  }

  try {
    const pressMatches = macroCode.match(/Press\(([^)]+)\)/g) || []
    const tapMatches = macroCode.match(/Tap\(([^)]+)\)/g) || []
    const allKeycodes = new Set<string>()

    ;[...pressMatches, ...tapMatches].forEach((match) => {
      const keycode = match
        .replace(/(Press|Tap)\(/, '')
        .replace(')', '')
        .trim()
      allKeycodes.add(keycode)
    })

    if (allKeycodes.size > 0) {
      selectedKeyCount.value = allKeycodes.size
      macroKeys.value = Array.from(allKeycodes).map((keycode, index) => ({
        keyId: `key_${index}`,
        keycode
      }))
      currentSelectedKeyIndex.value = 0
    } else {
      parseError.value = 'Could not parse macro actions. Expected Press() or Tap() functions.'
    }
  } catch (error) {
    parseError.value = `Error parsing macro: ${error}`
  }
}

const resetState = () => {
  selectedKeyCount.value = 0
  macroKeys.value = []
  currentSelectedKeyIndex.value = null
  parseError.value = ''
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      resetState()
    } else if (props.initialMacroCode) {
      parseExistingMacro(props.initialMacroCode)
    }
  }
)

watch(
  () => props.initialMacroCode,
  (newCode) => {
    if (newCode && props.isOpen) {
      parseExistingMacro(newCode)
    }
  }
)
</script>
