<template>
  <p class="font-bold">Key Info for key #{{ [...selectedKeys][0] }}</p>
  <p>selected {{ selectedKeys.size }} keys</p>
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
  <template v-if="keyboardStore.wiringMethod === 'matrix'">
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
    <p>Direct Pin Index</p>
    <input v-model="tmpKey.directPinIndex" type="text" class="keyinfo-input" @change="updateKey" />
  </div>
  <span>variant</span>
  <input v-model="tmpKey.variant[0]" type="text" class="keyinfo-input" @change="updateKey" />
  <span>variant option</span>
  <input v-model="tmpKey.variant[1]" type="text" class="keyinfo-input" @change="updateKey" />
  <span>rotation</span>
  <div class="flex">
    <input
      v-model="tmpKey.r"
      type="number"
      step="15"
      class="keyinfo-input w-1/3"
      @change="updateKey"
    />deg
    <input
      v-model="tmpKey.rx"
      type="number"
      step="1"
      class="keyinfo-input w-1/3"
      @change="updateKey"
    />
    <input
      v-model="tmpKey.ry"
      type="number"
      step="1"
      class="keyinfo-input w-1/3"
      @change="updateKey"
    />
  </div>
</template>

<script lang="ts" setup>
import { selectedKeys } from '../store'
import { computed, ref, watch } from 'vue'
import { isNumber } from '@vueuse/core'
import { keyboardStore } from '../store'
const props = defineProps(['layout'])

const tmpKey = ref<{
  x: number | ''
  y: number | ''
  x2: number | ''
  y2: number | ''
  w: number | ''
  h: number | ''
  w2: number | ''
  h2: number | ''
  d: boolean | ''
  matrix: (number | '')[]
  variant: (number | '')[]
  directPinIndex?: number | ''
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
  d: false,
  matrix: ['', ''],
  variant: ['', ''],
  directPinIndex: '',
  r: 0,
  rx: 0,
  ry: 0
})
// watch(
//   () => selectedKey.value.keyIndex,
//   () => {
//     console.log("key changed");
//     tmpKey.value = {
//       matrix: [NaN, NaN],
//       variant: [NaN, NaN],
//       ...props.layout[selectedKey.value.keyIndex],
//     };
//   }
// );

const updateSelectedKey = () => {
  console.log('updating selected keys')
  if ([...selectedKeys.value].length === 1) {
    const keyToLoad = props.layout[[...selectedKeys.value][0]]
    console.log(keyToLoad)

    tmpKey.value = {
      ...keyToLoad
    }
    if (keyToLoad.variant == undefined) {
      tmpKey.value.variant = ['', '']
    }
    if (keyToLoad.matrix == undefined) {
      tmpKey.value.matrix = ['', '']
    }
  } else {
    // set every property that has different values to ""
    tmpKey.value = {
      matrix: ['', ''],
      variant: ['', ''],
      directPinIndex: '',
      x2: '',
      x: '',
      y2: '',
      y: '',
      w: '',
      h: '',
      w2: '',
      h2: '',
      d: '',
      r: '',
      rx: '',
      ry: ''
    }
  }
}

updateSelectedKey()
watch(selectedKeys, () => {
  console.log('selected keys changed')
  updateSelectedKey()
})

// watch(
// //    selectedKeys,
//   () => updateSelectedKey()
// )

const updateKey = () => {
  selectedKeys.value.forEach((keyIndex) => {
    console.log('updating key with index', keyIndex, props.layout[keyIndex])
    // only modify if a field has a value
    // validate all fields and remove things that are set to default
    if (tmpKey.value.x !== '') props.layout[keyIndex].x = Number(tmpKey.value.x)
    if (tmpKey.value.x2 !== '') props.layout[keyIndex].x2 = Number(tmpKey.value.x2)
    if (tmpKey.value.y2 !== '') props.layout[keyIndex].y2 = Number(tmpKey.value.y2)
    if (tmpKey.value.y !== '') props.layout[keyIndex].y = Number(tmpKey.value.y)
    if (tmpKey.value.w !== '') props.layout[keyIndex].w = Number(tmpKey.value.w)
    if (tmpKey.value.h !== '') props.layout[keyIndex].h = Number(tmpKey.value.h)
    if (tmpKey.value.r !== '') props.layout[keyIndex].r = Number(tmpKey.value.r)
    if (tmpKey.value.rx !== '') props.layout[keyIndex].rx = Number(tmpKey.value.rx)
    if (tmpKey.value.ry !== '') props.layout[keyIndex].ry = Number(tmpKey.value.ry)
    if (tmpKey.value.directPinIndex !== '')
      props.layout[keyIndex].directPinIndex = Number(tmpKey.value.directPinIndex)

    // if (
    //   (tmpKey.value.matrix &&
    //     tmpKey.value.matrix.length == 2 &&
    //     tmpKey.value.matrix[0] !== "") ||
    //   tmpKey.value.matrix[1] !== ""
    // )
    //   props.layout[keyIndex].matrix = tmpKey.value.matrix.map(
    //     (a: string | number) => {
    //       if (a === "NaN" || a === "") return NaN;
    //       return Number(a);
    //     }
    //   );
    if (tmpKey.value.matrix && tmpKey.value.matrix[0] !== '') {
      console.log('updating matrix 0', tmpKey.value.matrix, props.layout[keyIndex].marix)
      if (!Array.isArray(props.layout[keyIndex].matrix)) {
        props.layout[keyIndex].matrix = [Number(tmpKey.value.matrix[0]), NaN]
      } else {
        props.layout[keyIndex].matrix[0] = Number(tmpKey.value.matrix[0])
      }
      console.log(props.layout[keyIndex].matrix)
    }
    if (tmpKey.value.matrix && tmpKey.value.matrix[1] !== '') {
      if (!props.layout[keyIndex].matrix) props.layout[keyIndex].matrix = [NaN, NaN]
      props.layout[keyIndex].matrix[1] = Number(tmpKey.value.matrix[1])
    }
    if (tmpKey.value.variant && tmpKey.value.variant[0] !== '') {
      if (!props.layout[keyIndex].variant) props.layout[keyIndex].variant = [NaN, NaN]
      props.layout[keyIndex].variant[0] = Number(tmpKey.value.variant[0])
    }
    if (tmpKey.value.variant && tmpKey.value.variant[1] !== '') {
      if (!props.layout[keyIndex].variant) props.layout[keyIndex].variant = [NaN, NaN]
      props.layout[keyIndex].variant[1] = Number(tmpKey.value.variant[1])
    }
  })
}

const matrixValid = computed(() => {
  return !isNumber(tmpKey.value.matrix[0]) || !isNumber(tmpKey.value.matrix[1])
})
</script>

<style lang="scss" scoped>
.keyinfo-input {
  @apply input-bordered input input-sm w-full flex-shrink;
  padding-left: 3px;
  padding-right: 3px;
}
.keydata-input-group {
  @apply flex items-center gap-1;
}
</style>
