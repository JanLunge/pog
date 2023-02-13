<template>
  <div
    v-if="Array.isArray(variant)"
    class="grid grid-cols-2 items-center gap-4 h-12"
  >
    <p class="text-right">
      {{ variantName }}
    </p>
    <select
      @change="selectMultiVariant"
      v-model="selectedOption"
      class="select select-bordered"
    >
      <option
        :value="oindex"
        v-for="(option, oindex) in variant.filter((a, i) => i !== 0)"
      >
        {{ option }}
      </option>
    </select>
  </div>
  <div v-else class="grid grid-cols-2 items-center gap-4 h-12">
    <p class="text-right">
      <input v-model="variantName" class="input input-sm input-bordered" />
    </p>
    <div class="flex gap-4">
      <input
        type="checkbox"
        class="checkbox"
        v-model="selectedBool"
        @input="selectBool"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { selectedConfig, selectedVariants } from "../store";

const props = defineProps(["variant", "index"]);
const selectedOption = ref(0);
const selectedBool = ref(false);
if (selectedConfig.value && selectedConfig.value.selectedVariants) {
  selectedBool.value =
    selectedConfig.value.selectedVariants[props.index] === 1;
  selectedOption.value = selectedConfig.value.selectedVariants[props.index];
}
const selectMultiVariant = () => {
  selectVariant({ layout: props.index, variant: selectedOption.value });
};
const selectBool = () => {
  selectVariant({ layout: props.index, variant: !selectedBool.value ? 1 : 0 });
};
const selectVariant = ({
  layout,
  variant,
}: {
  layout: number;
  variant: number;
}) => {
  if (!selectedConfig.value) return;
  if (!selectedConfig.value.selectedVariants) selectedConfig.value.selectedVariants = []
  selectedConfig.value.selectedVariants[layout] = variant;
};

const variantName = computed({
  get() {
    if (Array.isArray(props.variant)) return props.variant[0];
    return props.variant;
  },
  set(newVal) {
    if (Array.isArray(props.variant)) props.variant[0] = newVal;
    if (selectedConfig.value)
      selectedConfig.value.layouts.labels[props.index] = newVal;
  },
});
</script>

<style lang="scss" scoped></style>
