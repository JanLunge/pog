<template>
  <p class="font-bold">Keymap</p>
  <div>
    <div v-for="(layer, layerindex) in keyboardStore.keymap">
      layer {{ layerindex }}
      <div
        class="mb-4 grid gap-2 rounded border border-white border-opacity-40 p-2"
        :style="{
          gridTemplateColumns: `repeat(${keyboardStore.cols}, minmax(0, 1fr))`
        }"
      >
        <input
          v-for="(_key, index) in layer"
          v-model="keyboardStore.keymap[layerindex][index]"
          class="input input-bordered input-sm"
          placeholder="KC.A"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from '../store'
</script>

<style lang="scss" scoped></style>
