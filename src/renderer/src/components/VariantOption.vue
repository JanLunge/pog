<template>
  <div class="flex items-center pr-4">
    <div class="mr-2">
      <button class="btn btn-primary btn-xs" @click="removeOption">
        <i class="mdi mdi-close"></i>
      </button>
    </div>
    <div
      v-if="layout.variants && layout.variants.length > 0"
      class="flex h-12 w-full items-center gap-2"
    >
      <input v-model="variantName" type="text" class="input input-bordered input-sm" />
      <select
        v-model="selectedOption"
        class="select select-bordered select-sm mr-4"
        @change="selectMultiVariant"
      >
        <option
          v-for="(option, oindex) in layout.variants.filter((_a, i) => i !== 0)"
          :value="oindex"
        >
          {{ option }}
        </option>
      </select>
    </div>
    <div v-else class="flex h-12 w-full items-center gap-2">
      <input v-model="variantName" class="input input-bordered input-sm w-full" />
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
  selectVariant({
    layoutIndex: props.index,
    variant: !selectedBool.value ? 1 : 0
  })
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
const removeOption = () => {
  keyboardStore.layouts = keyboardStore.layouts.filter((_a, index) => index !== props.index)
}
</script>

<style lang="scss" scoped></style>
