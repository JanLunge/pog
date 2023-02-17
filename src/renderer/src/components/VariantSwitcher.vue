<template>
  <div>
    <p class="mb-4 text-xl font-bold">Layout Options</p>
    <button class="btn-sm btn" @click="addLayoutOption">add Layout Option</button>
    <VariantOption
      v-for="(layout, index) in keyboardStore.layouts"
      :layout="layout"
      :index="index"
    />
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from '../store'
import VariantOption from './VariantOption.vue'
const addLayoutOption = () => {
  keyboardStore.layouts.push({
    name: 'variant',
    selected: 0,
    variants: []
  })
}
</script>

<style lang="scss" scoped></style>
