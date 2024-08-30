<template>
  <div>
    <button class="btn btn-primary btn-sm mb-4" @click="addLayoutOption">
      <i class="mdi mdi-plus"></i> add Layout Option
    </button>
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
