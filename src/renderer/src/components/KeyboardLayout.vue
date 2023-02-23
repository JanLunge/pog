<template>
  <SelectionArea
    class="container"
    :options="{ selectables: ['.keycap'] }"
    :on-move="onMove"
    :on-start="onStart"
  >
    <div
      id="keyboardlayout-wrapper"
      class="relative my-5 flex items-center justify-center"
      :style="{ height: keyboardScale * (keyboardHeight * 58) + 'px' }"
    >
      <div
        id="keyboardlayout"
        class="relative h-64 w-full"
        :style="{
          width: keyboardWidth * 58 + 'px',
          height: keyboardHeight * 58 + 'px',
          transform: `scale( ${keyboardScale})`
        }"
        style="transform-origin: center left"
        :class="{ dragging: moving }"
      >
        <div
          v-if="mode === 'layout' && selectedKeys.size !== 0"
          class="rotation-origin-helper"
          :style="{ left: rotationOriginX, top: rotationOriginY }"
        ></div>
        <div class="wire-preview">
          <!--          for each key show 2 wires o the next keys-->
        </div>

        <key-cap
          v-for="(key, keyIndex) in keyLayout"
          :key="key.id"
          :key-data="key"
          :key-index="keyIndex"
          :mode="mode"
          :keymap="keymap"
          :matrix-width="matrixWidth"
          :layouts="layouts"
        >
        </key-cap>
      </div>
    </div>
  </SelectionArea>
</template>

<script lang="ts" setup>
import KeyCap from './KeyCap.vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { keyboardStore, selectedKeys } from '../store'
import { SelectionArea } from '@viselect/vue'
import type { SelectionEvent } from '@viselect/vue'
import { isNumber } from '@vueuse/core'
import { useDebounceFn } from '@vueuse/core'
const props = defineProps(['keyLayout', 'keymap', 'mode', 'matrixWidth','layouts'])
// mode can be layout or keymap

// find right edge
const keyboardWidth = computed(() => {
  let maxW = 0
  props.keyLayout.forEach((k) => {
    const width = k.w || 1
    const rightEdge = k.x + width
    if (rightEdge > maxW) {
      maxW = rightEdge
    }
  })
  return maxW
})

// find bottom edge
const keyboardHeight = computed(() => {
  let maxH = 0
  props.keyLayout.forEach((k) => {
    const height = k.h || 1
    const bottomEdge = k.y + height
    if (bottomEdge > maxH) {
      maxH = bottomEdge
    }
  })
  return maxH
})

const keyboardScale = ref(1)
const updateScale = () => {
  const wrapper = document.querySelector('#keyboardlayout-wrapper')
  if (wrapper) {
    const wrapperWidth = wrapper.clientWidth
    keyboardScale.value = Math.min(wrapperWidth / (keyboardWidth.value * 58), 1)
  }
}
onMounted(() => {
  // adjust keyboard size to fit
  updateScale()
  window.addEventListener('resize', updateScale)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
})

const rotationOriginX = computed(() => {
  if (!selectedKeys.value.size) return 0
  const firstSelectedKeyIndex = [...selectedKeys.value][0]
  if (!props.keyLayout[firstSelectedKeyIndex]) return '0'
  const x = props.keyLayout[firstSelectedKeyIndex].rx * 58
  return `${x}px` // return "xpx ypx"
})
const rotationOriginY = computed(() => {
  if (!selectedKeys.value.size) return 0
  const firstSelectedKeyIndex = [...selectedKeys.value][0]
  if (!props.keyLayout[firstSelectedKeyIndex]) return '0'
  const y = props.keyLayout[firstSelectedKeyIndex].ry * 58
  return `${y}px` // return "xpx ypx"
})

// const deselectKey = (e: MouseEvent) => {
//   console.log(e);
//   if (
//     e.target &&
//     (e.target as unknown as { id: string }).id === "keyboardlayout-wrapper"
//   ) {
//     selectedKeys.value.clear()
//     selectedKey.value = { keyIndex: NaN, key: [], args: false };
//   }
// };
const extractIndexes = (els: Element[]): number[] => {
  return els
    .map((v) => v.getAttribute('data-index'))
    .filter((a) => !isNumber(a))
    .map(Number)
}
const moving = ref(false)
const moveStart = ref({ x: 0, y: 0 })
const writtenDelta = ref({ x: 0, y: 0 })
const onStart = ({ event, selection }: SelectionEvent) => {
  if (props.mode === 'static') {
    selection.cancel()
    return
  }
  if (event?.shiftKey && props.mode === 'layout') {
    if (event instanceof MouseEvent) {
      // save start point
      moving.value = true
      moveStart.value.x = event.clientX
      moveStart.value.y = event.clientY
      writtenDelta.value.x = 0
      writtenDelta.value.y = 0
      selection.getSelectionArea().classList.add('hidden')
    }
    return
  }
  selection.getSelectionArea().classList.remove('hidden')
  if (!event?.ctrlKey && !event?.metaKey) {
    selection.clearSelection()
    selectedKeys.value.clear()
  }
}
const roundNearQtr = (number: number) => {
  return Math.round(number * 4) / 4
}
const onMove = ({
  store: {
    changed: { added, removed }
  },
  event
}: SelectionEvent) => {
  if(props.mode==='static'){
    return
  }
  if (event?.shiftKey && props.mode === 'layout') {
    if (event instanceof MouseEvent) {
      // console.log(event, selection);
      moving.value = true
      // move keys by start distance
      const delta = { x: 0, y: 0 }
      delta.x = (event.clientX - moveStart.value.x) * (1 / keyboardScale.value)
      delta.y = (event.clientY - moveStart.value.y) * (1 / keyboardScale.value)
      console.log(delta)
      // snap in every 0.25 of a key width 58
      const deltaTmp = {
        x: roundNearQtr(delta.x / 58),
        y: roundNearQtr(delta.y / 58)
      }
      // subtract already written distance
      console.log(deltaTmp)
      const writableDelta = {
        x: deltaTmp.x - writtenDelta.value.x,
        y: deltaTmp.y - writtenDelta.value.y
      }
      writtenDelta.value.x = deltaTmp.x
      writtenDelta.value.y = deltaTmp.y
      console.log(writableDelta)
      // write to each key
      selectedKeys.value.forEach((keyIndex) => {
        keyboardStore.keys[keyIndex].delta({ property: 'x', value: writableDelta.x })
        keyboardStore.keys[keyIndex].delta({ property: 'y', value: writableDelta.y })
      })
    }

    resetMoving()
    return
  }
  extractIndexes(added).forEach((id) => selectedKeys.value.add(id))
  extractIndexes(removed).forEach((id) => selectedKeys.value.delete(id))
  console.log(added, removed)
}
const resetMoving = useDebounceFn(() => {
  moving.value = false
}, 1000)
</script>

<style lang="scss" scoped>
.rotation-origin-helper {
  width: 5px;
  height: 5px;
  background: red;
  position: absolute;
  z-index: 10;
  border-radius: 5px;
  transform: translate(-50%, -50%);
}

.container {
  user-select: none;
  @apply p-4;
}
</style>
<style lang="scss">
.selection-area {
  background: rgba(152, 90, 19, 0.2);
  border: 2px solid rgb(242, 140, 24);
  border-radius: 0.1em;
  z-index: 100;
  &.hidden {
    opacity: 0;
  }
}
</style>
