<template>
  
    <div class="flex justify-between items-center h-10">
      <div v-if="selectedKeys.size === 0">
        <p class="font-bold">No keys selected</p>
      </div>
      <div v-else>
        <p class="font-bold">
          <template v-if="selectedKeys.size === 1">
            Key #{{ [...selectedKeys][0] }}
          </template>
          <template v-else>
            {{ selectedKeys.size }} keys selected
          </template>
        </p>
      </div>
      <div v-if="selectedKeys.size === 1" class="flex gap-2">
        <button 
          class="btn btn-sm" 
          :disabled="[...selectedKeys][0] === 0"
          @click="selectPreviousKey"
        >
          Previous Key
        </button>
        <button 
          class="btn btn-sm" 
          :disabled="[...selectedKeys][0] === layout.length - 1"
          @click="selectNextKey"
        >
          Next Key
        </button>
      </div>
  </div>
  <hr class="border-base-300">
  <p class="mt-2 text-sm">Basics</p>
  <div class="flex flex-col gap-2">
    <div class="grid grid-cols-4 gap-2 text-right">
      <div class="keydata-input-group">
        <span>x</span>
        <input
          v-model="tmpKey.x"
          type="text"
          placeholder="x"
          class="keyinfo-input"
          @change="updateKey"
        />
      </div>
      <div class="keydata-input-group">
        <span>y</span>
        <input
          v-model="tmpKey.y"
          type="text"
          placeholder="y"
          class="keyinfo-input"
          @change="updateKey"
        />
      </div>
      <div class="keydata-input-group">
        <span>x2</span>
        <input
          v-model="tmpKey.x2"
          type="text"
          placeholder="x2"
          class="keyinfo-input"
          @change="updateKey"
        />
      </div>
      <div class="keydata-input-group">
        <span>y2</span>
        <input
          v-model="tmpKey.y2"
          type="text"
          placeholder="y2"
          class="keyinfo-input"
          @change="updateKey"
        />
      </div>
    </div>
    <div class="grid grid-cols-4 gap-2 text-right">
      <div class="keydata-input-group">
        <span>w</span>
        <input
          v-model="tmpKey.w"
          placeholder="w"
          type="text"
          class="keyinfo-input"
          @change="updateKey"
        />
      </div>
      <div class="keydata-input-group">
        <span>h</span>
        <input
          v-model="tmpKey.h"
          placeholder="h"
          type="text"
          class="keyinfo-input"
          @change="updateKey"
        />
      </div>
      <div class="keydata-input-group">
        <span>w2</span>
        <input
          v-model="tmpKey.w2"
          placeholder="w2"
          type="text"
          class="keyinfo-input"
          @change="updateKey"
        />
      </div>
      <div class="keydata-input-group">
        <span>h2</span>
        <input
          v-model="tmpKey.h2"
          placeholder="h2"
          type="text"
          class="keyinfo-input"
          @change="updateKey"
        />
      </div>
    </div>
  </div>
  <template v-if="keyboardStore.wiringMethod === 'matrix' && false">
    <p class="mt-2 text-sm" :class="{ 'text-error': matrixValid }">Matrix</p>
    <div class="flex gap-2">
      <div class="keydata-input-group">
        <span>row</span>
        <input
          v-model="tmpKey.matrix[0]"
          type="text"
          class="keyinfo-input w-1/2"
          placeholder="row"
          @change="updateKey"
        />
      </div>
      <div class="keydata-input-group">
        <span>col</span>
        <input
          v-model="tmpKey.matrix[1]"
          type="text"
          class="keyinfo-input w-1/2"
          placeholder="col"
          @change="updateKey"
        />
      </div>
    </div>
  </template>
  <div>
    <p>Key Index <span class="text-xs">(from CoordMap)</span></p>
    <input v-model="tmpKey.coordMapIndex" type="text" class="keyinfo-input" @change="updateKey" />
  </div>
  <div>
    <p>Encoder Index</p>
    <input v-model="tmpKey.encoderIndex" type="text" class="keyinfo-input" @change="updateKey" />
  </div>
  <div v-if="keyboardStore.layouts.length !== 0" class="flex gap-1">
    <label>
      <span>Variant</span>
      <input v-model="tmpKey.variant[0]" type="text" class="keyinfo-input" @change="updateKey" />
    </label>
    <label>
      <span>Variant option</span>
      <input v-model="tmpKey.variant[1]" type="text" class="keyinfo-input" @change="updateKey" />
    </label>
  </div>
  <span>Rotation</span>
  <div class="flex gap-1">
    <input
      v-model="tmpKey.r"
      type="number"
      step="1"
      class="keyinfo-input w-1/3"
      @change="updateKey"
    />deg
    <input
      v-model="tmpKey.rx"
      type="number"
      step="1"
      class="keyinfo-input w-1/3"
      placeholder="rotation x"
      @change="updateKey"
    />
    <input
      v-model="tmpKey.ry"
      type="number"
      step="1"
      class="keyinfo-input w-1/3"
      placeholder="rotation y"
      @change="updateKey"
    />
  </div>
</template>

<script lang="ts" setup>
import { Key, selectedKeys } from '../store'
import { computed, ref, watch } from 'vue'
import { isNumber } from '@vueuse/core'
import { keyboardStore } from '../store'
const props = defineProps<{
  layout: Key[]
}>()

const tmpKey = ref<{
  x: number | ''
  y: number | ''
  x2: number | ''
  y2: number | ''
  w: number | ''
  h: number | ''
  w2: number | ''
  h2: number | ''

  matrix: (number | '')[]
  variant: (number | '')[]
  coordMapIndex?: number | ''
  encoderIndex?: number | ''
  r: number | ''
  rx: number | ''
  ry: number | ''
}>({
  x: 0,
  y: 0,
  x2: 0,
  y2: 0,
  w: 1,
  h: 1,
  w2: 0,
  h2: 0,

  matrix: ['', ''],
  variant: ['', ''],
  coordMapIndex: '',
  encoderIndex: '',
  r: 0,
  rx: 0,
  ry: 0
})

const isAttrSame = (keys, attr) => {
  return keys.reduce((acc, val) => acc.add(val[attr]), new Set()).size === 1
}
const getSameKeyAttrs = (keys) => {
  console.log(keys)
  const sameAttrs = new Map()
  ;['y', 'y2', 'x', 'x2', 'w', 'w2', 'h', 'h2', 'r', 'ry', 'rx', 'encoderIndex'].forEach((attr) => {
    if (isAttrSame(keys, attr) && keys[0][attr] !== undefined) {
      console.log('attr is same', attr)
      sameAttrs.set(attr, keys[0][attr])
    }
  })
  const returnObj = Object.fromEntries(sameAttrs)
  console.log(returnObj)
  return returnObj
}
const updateSelectedKey = () => {
  console.log('updating selected keys')
  console.log(props.layout)
  console.log(selectedKeys.value)
  if ([...selectedKeys.value].length === 1 && props.layout?.length > 0) {
    const keyToLoad = props.layout[[...selectedKeys.value][0]]

    // only load overlapping data from all selected keys

    tmpKey.value = {
      x: keyToLoad.x,
      y: keyToLoad.y,
      x2: keyToLoad.x2 ?? '',
      y2: keyToLoad.y2 ?? '',
      w: keyToLoad.w,
      h: keyToLoad.h,
      w2: keyToLoad.w2 ?? '',
      h2: keyToLoad.h2 ?? '',
      r: keyToLoad.r,
      rx: keyToLoad.rx,
      ry: keyToLoad.ry,
      matrix: keyToLoad.matrix ?? ['', ''],
      variant: keyToLoad.variant ?? ['', ''],
      coordMapIndex: keyToLoad.coordMapIndex ?? '',
      encoderIndex: keyToLoad.encoderIndex ?? ''
    }
  } else {
    // set every property that has different values to ""
    tmpKey.value = {
      matrix: ['', ''],
      variant: ['', ''],
      coordMapIndex: '',
      encoderIndex: '',
      x2: '',
      x: '',
      y2: '',
      y: '',
      w: '',
      h: '',
      w2: '',
      h2: '',
      r: '',
      rx: '',
      ry: ''
    }
    const attrs = getSameKeyAttrs(props.layout.filter((_a, i) => selectedKeys.value.has(i)))
    tmpKey.value = { ...tmpKey.value, ...attrs }
  }
}
updateSelectedKey()

watch(
  () => new Set(selectedKeys.value),
  (newVal) => {
    console.log('selected keys changed', newVal)
    updateSelectedKey()
  },
  { deep: true }
)

const emit = defineEmits(['update:layout'])

const updateKey = () => {
  // Create a new copy of the layout to modify
  const newLayout = [...props.layout]
  
  selectedKeys.value.forEach((keyIndex) => {
    // Create a new object with only the modified properties
    const updates: Partial<(typeof props.layout)[0]> = {}

    // Only add properties to updates if they have a non-empty value
    if (tmpKey.value.x !== '') updates.x = Number(tmpKey.value.x)
    if (tmpKey.value.x2 !== '') updates.x2 = Number(tmpKey.value.x2)
    if (tmpKey.value.y2 !== '') updates.y2 = Number(tmpKey.value.y2)
    if (tmpKey.value.y !== '') updates.y = Number(tmpKey.value.y)
    if (tmpKey.value.w !== '') updates.w = Number(tmpKey.value.w)
    if (tmpKey.value.h !== '') updates.h = Number(tmpKey.value.h)
    if (tmpKey.value.w2 !== '') updates.w2 = Number(tmpKey.value.w2)
    if (tmpKey.value.h2 !== '') updates.h2 = Number(tmpKey.value.h2)
    if (tmpKey.value.r !== '') updates.r = Number(tmpKey.value.r)
    if (tmpKey.value.rx !== '') updates.rx = Number(tmpKey.value.rx)
    if (tmpKey.value.ry !== '') updates.ry = Number(tmpKey.value.ry)

    // Handle coordMapIndex only if it was explicitly changed
    if (tmpKey.value.coordMapIndex !== '') {
      updates.coordMapIndex = Number(tmpKey.value.coordMapIndex)
    }

    // Handle encoderIndex only if it was explicitly changed
    if (tmpKey.value.encoderIndex !== '') {
      updates.encoderIndex = Number(tmpKey.value.encoderIndex)
    }

    // Handle matrix updates
    if (tmpKey.value.matrix) {
      if (tmpKey.value.matrix[0] !== '') {
        if (!Array.isArray(newLayout[keyIndex].matrix)) {
          updates.matrix = [Number(tmpKey.value.matrix[0]), NaN]
        } else {
          updates.matrix = [...newLayout[keyIndex].matrix]
          updates.matrix[0] = Number(tmpKey.value.matrix[0])
        }
      }
      if (tmpKey.value.matrix[1] !== '') {
        updates.matrix = Array.isArray(updates.matrix)
          ? updates.matrix
          : Array.isArray(newLayout[keyIndex].matrix)
          ? [...newLayout[keyIndex].matrix]
          : [NaN, NaN]
        updates.matrix[1] = Number(tmpKey.value.matrix[1])
      }
    }

    // Handle variant updates
    if (tmpKey.value.variant) {
      if (tmpKey.value.variant[0] !== '') {
        updates.variant = Array.isArray(newLayout[keyIndex].variant)
          ? [...newLayout[keyIndex].variant]
          : [NaN, NaN]
        updates.variant[0] = Number(tmpKey.value.variant[0])
      }
      if (tmpKey.value.variant[1] !== '') {
        updates.variant = Array.isArray(updates.variant)
          ? updates.variant
          : Array.isArray(newLayout[keyIndex].variant)
          ? [...newLayout[keyIndex].variant]
          : [NaN, NaN]
        updates.variant[1] = Number(tmpKey.value.variant[1])
      }
    }

    // Update the key in our new layout copy
    newLayout[keyIndex] = Object.assign(newLayout[keyIndex], updates)
    savePartialLayout(newLayout)
  })

  // Emit the entire updated layout once
  emit('update:layout', newLayout)
}

const matrixValid = computed(() => {
  return !isNumber(tmpKey.value.matrix[0]) || !isNumber(tmpKey.value.matrix[1])
})

const savePartialLayout = (newLayout: Key[]) => {
  console.log('saving partial layout', newLayout)
  newLayout.forEach((key, i) => {
    // Only update specific properties that can be changed in the layout editor
    const keyProps = ['x', 'y', 'x2', 'y2', 'w', 'h', 'w2', 'h2', 'r', 'rx', 'ry', 'matrix', 'variant', 'coordMapIndex', 'encoderIndex']
    keyProps.forEach(prop => {
      if (key[prop] !== undefined && key[prop] !== keyboardStore.keys[i][prop]) {
        keyboardStore.keys[i][prop] = key[prop]
      }
    })
  })
}

const selectNextKey = () => {
  const currentKey = [...selectedKeys.value][0]
  if (currentKey < props.layout.length - 1) {
    selectedKeys.value = new Set([currentKey + 1])
  }
}

const selectPreviousKey = () => {
  const currentKey = [...selectedKeys.value][0]
  if (currentKey > 0) {
    selectedKeys.value = new Set([currentKey - 1])
  }
}
</script>

<style lang="scss" scoped>
.keyinfo-input {
  @apply input input-bordered input-sm w-full flex-shrink;
  padding-left: 3px;
  padding-right: 3px;
}
.keydata-input-group {
  @apply flex items-center gap-1;
}
</style>
