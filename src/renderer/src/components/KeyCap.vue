<template>
  <div
    v-if="visible"
    class="keycap"
    style="user-select: none"
    :data-index="keyIndex"
    :style="{
      left: keyData.x * (baseKeyWidth + keyGap) + 'px',
      top: keyData.y * (baseKeyWidth + keyGap) + 'px',
      width: keyWidth + 'px',
      height: keyHeight + 'px',
      transform: `rotate(${keyData.r}deg)`,
      transformOrigin: rotationOrigin
    }"
    :class="{ selected: mainSelected }"
  >
    <div
      v-if="keyData.w2 || keyData.h2"
      class="keyborder-blocker"
      :style="{
        left: '1px',
        top: '1px',
        width: keyWidth - 2 + 'px',
        height: keyHeight - 2 + 'px'
      }"
    ></div>
    <div
      class="keyborder"
      :style="{
        width: keyWidth + 'px',
        height: keyHeight + 'px'
      }"
    ></div>
    <div
      v-if="keyData.w2 || keyData.h2"
      class="keyborder"
      :class="{ selected: mainSelected }"
      :style="{
        left: keyData.x2 * baseKeyWidth - 1 + 'px',
        width: keyWidth2 + 'px',
        height: keyHeight2 + 'px'
      }"
    ></div>
    <div
      v-if="keyData.w2 || keyData.h2"
      class="keytop"
      :style="{
        height: keyTopHeight2 + 'px',
        width: keyTopWidth2 + 'px',
        left: keyData.x2 * baseKeyWidth + keyGap + 'px'
      }"
    ></div>
    <!--    <div-->
    <!--      class="keytop"-->
    <!--      @click="bgClick"-->
    <!--    ></div>-->
    <div
      class="keytop"
      :style="{
        height: keyTopHeight + 'px',
        width: keyTopWidth + 'px'
      }"
    ></div>
    <div class="keylabels">
      <!--      <div class="keylabel" :class="['keylabel-'+index]" v-for="(label,index) in keyData.labels">-->
      <!--        <div class="keylabel-inner">-->
      <!--          {{label}}-->
      <!--        </div>-->
      <!--      </div>-->
      <div v-if="!hasArguments" class="keylabel keylabel-center" v-html="mainLabel"></div>
      <div v-else class="keylabel">
        <div class="arg-top">{{ mainLabel }}</div>
        <div class="arg-bottom" :class="{ selected: argsSelected }">
          {{ argLabel }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { selectedLayer, selectedKeys, keyboardStore } from '../store'
import { matrixPositionToIndex, renderLabel } from '../helpers'

const props = defineProps(['keyData', 'keyIndex', 'mode', 'keymap', 'matrixWidth'])
defineEmits(['selected'])

const keyGap = 4
// hide normal labels and show the keymap thing
const action = computed(() => {
  if (props.mode === 'layout') return //String(props.keyData.matrix)
  const keyIndex = matrixPositionToIndex({
    pos: props.keyData.matrix,
    matrixWidth: props.matrixWidth
  })
  if (!props.keymap[selectedLayer.value]) return 'l missing'
  const keyCode = props.keymap[selectedLayer.value][keyIndex]
  // resolve readable character
  if (!keyCode || keyCode === 'KC.TRNS') return '▽'
  return keyCode
})

const visible = computed(() => {
  // hide decal keys
  if (props.keyData.d) {
    return false
  }
  // show correct variant
  const variant: number[] = props.keyData.variant
  if (variant) {
    if (variant.length !== 2) return false
    return keyboardStore.layouts[variant[0]].selected === variant[1]
  }
  // show keys that don't have variant
  return true
})

const baseKeyWidth = ref(54)
const keyWidthU = computed(() => {
  // if(props.keyData.w2) return props.keyData.w2
  return props.keyData.w || 1
})
const keyHeightU = computed(() => {
  return props.keyData.h || 1
})
const keyWidth2U = computed(() => {
  return props.keyData.w2 || 1
})
const keyHeight2U = computed(() => {
  return props.keyData.h2 || 1
})
const keyWidth = computed(() => {
  return keyWidthU.value * baseKeyWidth.value + (keyWidthU.value - 1) * keyGap
})
const keyHeight = computed(() => {
  return keyHeightU.value * baseKeyWidth.value + (keyHeightU.value - 1) * keyGap
})
const keyWidth2 = computed(() => {
  return keyWidth2U.value * baseKeyWidth.value + (keyWidth2U.value - 1) * keyGap
})
const keyHeight2 = computed(() => {
  return keyHeight2U.value * baseKeyWidth.value + (keyHeight2U.value - 1) * keyGap
})
const hasArguments = computed(() => {
  return false
  // if (!action.value) return false
  // return action.value.includes(')')
})
const keyTopWidth = computed(() => {
  return keyWidth.value - keyGap * 2 - 4 //+ ((keyWidthU.value-1)*keyGap))
})
const keyTopHeight = computed(() => {
  return keyHeight.value - 6 * keyHeightU.value - keyGap + (keyHeightU.value - 1) * keyGap
})
const keyTopWidth2 = computed(() => {
  return keyWidth2.value - 6 * keyWidth2U.value - keyGap - 2 + (keyWidth2U.value - 1) * keyGap
})
const keyTopHeight2 = computed(() => {
  return keyHeight2.value - 6 * keyHeight2U.value - keyGap + (keyHeight2U.value - 1) * keyGap
})
const mainLabel = computed(() => {
  // in Layout Mode show the matrix pos
  if (props.mode === 'layout') {
    return props.keyData.getMatrixLabel()
  }
  // otherwise show the action from the keymap
  if (!action.value) return ''

  // render readable label
  return renderLabel(action.value)
})

const argLabel = computed(() => {
  if (hasArguments.value && action.value) {
    const argAction = action.value.split('(')[1].replace(')', '')
    if (argAction.startsWith('KC.')) {
      return argAction.split('.')[1]
    }
    return argAction
  }
  return
})

const mainSelected = ref(false)
const argsSelected = ref(false)
// const bgClick = (e:MouseEvent) => {
//   mainSelected.value = true;
//   argsSelected.value = false;
//   emit("selected", {
//     key: props.keyData.matrix,
//     args: argsSelected.value,
//     keyIndex: props.keyIndex,
//     added: e.shiftKey
//   });
// };
// const argClick = () => {
//   argsSelected.value = true;
//   mainSelected.value = false;
//   emit("selected", {
//     key: props.keyData.matrix,
//     args: argsSelected.value,
//     keyIndex: props.keyIndex,
//   });
// };

// watch(
//   () => selectedKey.value.key,
//   (newValue) => {
//     if (selectedKey.value.key !== props.keyData.matrix) {
//       mainSelected.value = false;
//       argsSelected.value = false;
//     }
//   }
// );
watch(
  () => [...selectedKeys.value],
  (_newValue) => {
    if (selectedKeys.value.has(props.keyIndex)) {
      mainSelected.value = true
      argsSelected.value = false
    } else {
      mainSelected.value = false
      argsSelected.value = false
    }
  }
)
const rotationOrigin = computed(() => {
  if (typeof props.keyData.rx !== 'number' || typeof props.keyData.ry !== 'number') return '0 0'
  const x = props.keyData.rx * 58 - props.keyData.x * (baseKeyWidth.value + keyGap)
  const y = props.keyData.ry * 58 - props.keyData.y * (baseKeyWidth.value + keyGap)
  return `${x}px ${y}px` // return "xpx ypx"
})
</script>

<style lang="scss" scoped>
.keyborder {
  // outer key outline and background
  background: #333;
  position: absolute;
  width: 54px;
  height: 54px;
  border: 1px solid transparent;
  cursor: pointer;
  @apply rounded;
  z-index: 0;
  .selected & {
    border-color: white;
    z-index: 4;
    box-shadow: rgba(0, 0, 0, 0.6) 2px 2px 8px 0;
  }
}
.keyborder-blocker {
  background: #333;
  position: absolute;
  width: 52px;
  height: 52px;
  cursor: pointer;
  @apply rounded;
  z-index: 1;
}
.keytop {
  position: absolute;
  height: 42px;
  width: calc(100% - 12px);
  left: 6px;
  top: 4px;
  right: 6px;
  background: #444;
  cursor: pointer;
  @apply rounded;
  z-index: 2;
  .selected & {
    z-index: 5;
  }
}
.keylabels {
  position: absolute;
  pointer-events: none;
  width: calc(100% - 12px);
  left: 6px;
  top: 4px;
  right: 6px;
  z-index: 3;
  .selected & {
    z-index: 6;
  }
}
.keylabel {
  font-size: 12px;
  position: absolute;
  width: 100%;
  height: calc(48px - 5px);

  &-0 {
    left: 8px;
    top: 2px;
    @apply flex items-start justify-start text-center;
  }
  &-3 {
    right: 8px;
    bottom: 2px;
    @apply flex items-end justify-end text-center;
  }
  &-center {
    @apply flex items-center justify-center text-center;
  }
  .arg-top {
    @apply text-center;
    position: absolute;
    top: 0px;
    left: 6px;
    right: 6px;
    font-size: 10px;
  }
  .arg-bottom {
    @apply flex items-center justify-center rounded text-center;
    position: absolute;
    border: 1px solid #666;
    left: 6px;
    right: 6px;
    bottom: 2px;
    height: 28px;
    pointer-events: all;
    cursor: pointer;
    &.selected {
      border-color: white;
    }
  }
}
.keycap {
  position: absolute;
  //width: 54px;
  //height: 54px;
  @apply transition-all;
  .dragging & {
    transition: all 0.08s ease-out;
  }
}
//.keycap {
//  width: 50px;
//  height: 50px;
//  position: absolute;
//  background: #333;
//  @apply rounded;
//  &::after{
//    @apply absolute;
//    background: #red;
//    width: 100px;
//    height: 100px;
//    content: '';
//  }
//}
</style>
<style lang="scss">
.keylabel {
  i.mdi {
    font-size: 18px;
  }
}
</style>
