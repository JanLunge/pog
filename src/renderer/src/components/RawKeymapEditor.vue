<template>
  <p class="font-bold">Keymap</p>
  <div>
    <div v-for="(layer, layerindex) in keyboardStore.keymap">
      layer {{ layerindex }}
      <div
        class="border rounded border-opacity-40 border-white p-2 grid gap-2 mb-4"
        :style="{
          gridTemplateColumns: `repeat(${keyboardStore.cols}, minmax(0, 1fr))`,
        }"
      >
        <input
          class="input input-sm input-bordered"
          v-for="(_key, index) in layer"
          v-model="keyboardStore.keymap[layerindex][index]"
          placeholder="KC.A"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {keyboardStore} from "../store";
</script>

<style lang="scss" scoped></style>
