<template>
  <div
    class="flex gap-4 items-center mb-4"
    v-if="
      selectedConfig &&
      selectedConfig.encoderKeymap[lindex] &&
      selectedConfig.encoderKeymap[lindex][eindex]
    "
  >
    <p class="w-24">layer {{ lindex }}</p>
    <input
      type="text"
      class="input input-bordered"
      v-model="selectedConfig.encoderKeymap[lindex][eindex][0]"
    />
    <input
      type="text"
      class="input input-bordered"
      v-model="selectedConfig.encoderKeymap[lindex][eindex][1]"
    />
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from "../store";
const props = defineProps(["lindex", "layer", "eindex"]);
if (selectedConfig.value) {
  if (!selectedConfig.value.encoderKeymap[props.lindex]) {
    // create the layer
    selectedConfig.value.encoderKeymap[props.lindex] = [];
  }
  if (!selectedConfig.value.encoderKeymap[props.lindex][props.eindex]) {
    selectedConfig.value.encoderKeymap[props.lindex][props.eindex] = [
      "KC.TRNS",
      "KC.TRNS",
    ];
  }
}
</script>

<style lang="scss" scoped></style>
