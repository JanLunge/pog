<template>
  <dialog id="flash_modal" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Attention</h3>
      <p class="py-4">
        Flashing the POG utilities onto the keyboard will erase <tt>code.py</tt> and other related files from
        the keyboard.
      </p>
      <p class="py-4">Be sure to backup your code if you still need any of it.</p>
      <div class="flex justify-between">
        <div class="btn">Abort</div>
        <div class="btn btn-warning" @click="flashCoordMapping({ overwrite: true })">Flash POG</div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>Close</button>
    </form>
  </dialog>
<div>
    <p class="py-4">1. Install the debug code on the keyboard</p>
    <button class="btn btn-primary btn-sm" @click="promptFlashing">
      Flash CoordMap Finder to keyboard
    </button>
    <div>
      <p class="py-4">2. Click the text area and follow the guide below</p>
      <p class="mb-4">
        3. Press each key starting from the top left corner of the first row, moving right across the row. 
        When you reach the end, press the last key once more to begin the next row.
      </p>
      <p class="py-4">
        If nothing happens, first replug the board in case it hasn't started, then wait 5 seconds.
        If this doesn't help, check the diode direction or pins.
      </p>
      <p class="py-4">
        The CoordMap will be printed as a list of 3-digit numbers separated by space.<br />
        e.g., 001 005 008 002 ... <br />
        It outputs via a hotkey on the number row, so make sure to switch to QWERTY if you're using 
        AZERTY or another layout that maps different keys to the number row. For split keyboards, 
        try setting the CoordMap type to "normal," as the secondary half might not output to USB 
        depending on the split side detection.
      </p>
      <textarea
        id="keycapture"
        v-model="coordmap"
        class="textarea textarea-bordered w-full font-mono"
      ></textarea>
    </div>
    <div class="flex gap-2 py-4">
      <button class="btn btn-primary" @click="addRow">New Row</button>
      <button class="btn btn-primary" @click="addSpc">Add Space</button>
      <button class="btn btn-primary" @click="rmLast">Remove Last</button>
      <button class="btn btn-primary" @click="clear">Clear</button>
    </div>
    <div>
      <KeyboardLayout
        :key-layout="keyboardlayout"
        :keymap="[]"
        :layouts="[]"
        mode="layout"
      ></KeyboardLayout>
    </div>
    <div>
      <pre class="my-2 rounded bg-base-300 p-4">{{ coordmapstring }}</pre>
    </div>
    <div class="flex gap-2">
      <button class="btn btn-primary mt-2" @click="done">
        {{ initialSetup ? 'Next' : 'Save CoordMap & Create Keyboard Layout' }}
      </button>
      <button v-if="!initialSetup" class="btn btn-primary mt-2" @click="onlySave">
        Only Save CoordMap
      </button>
    </div>
    <p class="my-4">
      <strong>Note:</strong> If your key indexes have changed, you need to rebuild your layout or 
      adjust the indexes in the layout editor. Only saving the CoordMap is advisable if you want 
      to modify spacing without changing the key order.
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import KeyboardLayout from './KeyboardLayout.vue'
import { Key, keyboardStore, KeyInfo } from '../store'
const coordmap = ref('')
const props = defineProps<{ initialSetup: boolean }>()
const emits = defineEmits(['next'])

console.log('loading coordmap', keyboardStore.coordMap)
coordmap.value = keyboardStore.coordMap
  .map((row) => {
    return row.join(' ')
  })
  .join(' row ')

const addRow = () => {
  coordmap.value = coordmap.value + '\n'
  ;(document.querySelector('#keycapture') as HTMLInputElement).focus()
}
const addSpc = () => {
  coordmap.value += 'spc '
  ;(document.querySelector('#keycapture') as HTMLInputElement).focus()
}
const done = () => {
  keyboardStore.setKeys(keyboardlayout.value as KeyInfo[])
  keyboardStore.coordMap = keys.value
  emits('next')
}
const onlySave = () => {
  keyboardStore.coordMap = keys.value
}
const promptFlashing = () => {
  if (props.initialSetup) {
    // after valid ok then flash file with overwrite on
    ;(document.getElementById('flash_modal') as HTMLDialogElement).showModal()
  } else {
    flashCoordMapping({ overwrite: false })
  }
}
const flashCoordMapping = async ({ overwrite }: { overwrite: boolean }) => {
  console.log('flashCoordMapping with overwrite:', overwrite)
  keyboardStore.coordMapSetup = true
  ;(document.getElementById('flash_modal') as HTMLDialogElement).close()
  overwrite = Boolean(overwrite)
  await window.api.saveConfiguration(
    JSON.stringify({
      pogConfig: keyboardStore.serialize(),
      writeFirmware: overwrite,
      writeCoordMapHelper: true
    })
  )
}
const keys = computed(() => {
  // array of rows
  const tmpKeys = coordmap.value.replaceAll(/\n|\r\n|\r/gi, ' row ')
  const rows: any[] = []
  let rowIndex = 0
  let lastkey = ''
  tmpKeys.split(' ').forEach((key) => {
    if (key === '' || key.length !== 3) return
    // next row
    if (key === lastkey && !['row', 'spc'].includes(key)) {
      if (!coordmap.value.endsWith(' ')) return
      coordmap.value = coordmap.value.slice(0, -4)
      addRow()
      return
    }
    if (key === 'row') {
      rowIndex++
      return
    }
    if (!rows[rowIndex]) rows[rowIndex] = []
    rows[rowIndex].push(key)
    lastkey = key
  })
  return rows
})
const coordmapstring = computed(() => {
  let str = 'coord_mapping = [\n'
  keys.value.forEach((row) => {
    str += row.join(',') + ',\n'
  })
  str += ']'
  return str.replaceAll(/spc,/gi, '    ')
})
const keyboardlayout = computed(() => {
  const realKeys: Key[] = []
  let globalkeyindex = 0
  keys.value.forEach((row, rowindex) => {
    row.forEach((key, kindex) => {
      if (key === 'spc') return
      const keyToAdd = new Key({
        x: kindex,
        y: rowindex,
        idx: globalkeyindex
      })
      realKeys.push(keyToAdd)
      globalkeyindex++
    })
  })
  console.log(realKeys)
  return realKeys
})

const rmLast = () => {
  coordmap.value = coordmap.value.split(' ').slice(0, -1).join(' ')
}
const clear = () => {
  coordmap.value = ''
}
</script>

<style lang="scss" scoped></style>
