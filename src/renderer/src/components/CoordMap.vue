<template>
  <div>
    <p class="py-4">1. install the debug code on the keyboard</p>
    <button class="btn-primary btn btn-sm" @click="flashCoordMapping">
      Flash CoordMap Finder to keyboard
    </button>
    <div>
      <p class="py-4">2. Click the text area and follow the guide below</p>
      <textarea
        id="keycapture"
        v-model="coordmap"
        class="textarea-bordered textarea w-full font-mono"
      ></textarea>
    </div>
    <div class="flex gap-2 py-4">
      <button class="btn-primary btn" @click="addRow">new Row</button>
      <button class="btn-primary btn" @click="addSpc">add Space</button>
      <button class="btn-primary btn" @click="rmLast">remove last</button>
      <button class="btn-primary btn" @click="clear">clear</button>
    </div>
    <p class="mb-4">
      3. Now press each key starting in the top left corner in the first row and moving to the right
      when you reached the end press the last key once again to start with the next row
    </p>

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

    <button class="btn-primary btn mt-2" @click="done">
      {{ initialSetup ? 'next' : 'save Coord Maping & create keyboard layout' }}
    </button>
    <button class="btn-primary btn mt-2" @click="onlySave"  v-if="!initialSetup">
      only save Coord Maping
    </button>
    </div>
    <p class="my-4">note if your key indexes changed you need to rebuild your layout or adjust the indexes on the layout editor, only saving the coord map is only advisable if you wanted to modify spacings but not the order of the keys</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import KeyboardLayout from './KeyboardLayout.vue'
import { Key, keyboardStore, KeyInfo } from '../store'
const coordmap = ref('')
 defineProps(['initialSetup'])
const emits = defineEmits(['next'])

console.log('loading coordmap', keyboardStore.coordMap)
coordmap.value = keyboardStore.coordMap
  .map((row) => {
    return row.join(' ')
  })
  .join(' row ')

const addRow = () => {
  coordmap.value = coordmap.value + '\n';
  (document.querySelector('#keycapture') as HTMLInputElement).focus()
}
const addSpc = () => {
  coordmap.value += 'spc ';
  (document.querySelector('#keycapture') as HTMLInputElement).focus()
}
const done = () => {
  keyboardStore.setKeys(keyboardlayout.value as KeyInfo[])
  keyboardStore.coordMap = keys.value
  emits('next')
}
const onlySave = () => {
  keyboardStore.coordMap = keys.value
}
const flashCoordMapping = async () => {
  keyboardStore.coordMapSetup = true
  await window.api.saveConfiguration(
    JSON.stringify({ pogConfig: keyboardStore.serialize(), writeFirmware: false, writeCoordMapHelper: true })
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
  const realKeys :Key[]= []
  let globalkeyindex = 0
  keys.value.forEach((row, rowindex) => {
    row.forEach((key, kindex) => {
      if (key === 'spc') return
      realKeys.push(new Key({ x: kindex, y: rowindex, directPinIndex: globalkeyindex }))
      globalkeyindex++
    })
  })
  console.log(realKeys)
  return realKeys
})

const rmLast = () => {
  coordmap.value = coordmap.value.split(' ').slice(0, -1).join(' ');
}
const clear = ()=>{
  coordmap.value=''
}
</script>

<style lang="scss" scoped></style>
