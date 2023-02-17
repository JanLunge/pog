<template>
  <div v-if="layout.variants && layout.variants.length > 0" class="grid h-12 grid-cols-2 items-center gap-4">
    <p class="text-right">
      {{ variantName }}
    </p>
    <select v-model="selectedOption" class="select-bordered select" @change="selectMultiVariant">
      <option v-for="(option, oindex) in layout.variants.filter((a, i) => i !== 0)" :value="oindex">
        {{ option }}
      </option>
    </select>
  </div>
  <div v-else class="grid h-12 grid-cols-2 items-center gap-4">
    <p class="text-right">
      <input v-model="variantName" class="input-bordered input input-sm" />
    </p>
    <div class="flex gap-4">
      <input v-model="selectedBool" type="checkbox" class="checkbox" @input="selectBool" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { keyboardStore } from '../store'

const props = defineProps(['layout', 'index'])
const selectedOption = ref(0)
const selectedBool = ref(false)
selectedBool.value = keyboardStore.layouts[props.index].selected === 1
selectedOption.value = keyboardStore.layouts[props.index].selected
const selectMultiVariant = () => {
  selectVariant({ layoutIndex: props.index, variant: selectedOption.value })
}
const selectBool = () => {
  selectVariant({ layoutIndex: props.index, variant: !selectedBool.value ? 1 : 0 })
}
const selectVariant = ({ layoutIndex, variant }: { layoutIndex: number; variant: number }) => {
  keyboardStore.layouts[layoutIndex].selected = variant
}

const variantName = computed({
  get() {
    return props.layout.name
  },
  set(newVal) {
    keyboardStore.layouts[props.index].name = newVal
  }
})
</script>

<style lang="scss" scoped></style>
