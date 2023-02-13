<template>
  <div v-if="selectedConfig && selectedConfig.layouts">
    <p class="text-xl font-bold mb-4">Layout Options</p>
    <button class="btn btn-sm" @click="addLayoutOption">
      add Layout Option
    </button>
    <VariantOption
      v-for="(variant, index) in selectedConfig.layouts.labels"
      :variant="variant"
      :index="index"
    />
  </div>
</template>

<script lang="ts" setup>
import { selectedConfig } from "../store";
import VariantOption from "./VariantOption.vue";
const addLayoutOption = () => {
  selectedConfig.value?.layouts.labels.push("");
};
</script>

<style lang="scss" scoped></style>
