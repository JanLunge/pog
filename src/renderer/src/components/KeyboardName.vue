<template>
  <div class="mt-8">
    <div class="mb-4">
      <p class="mb-2 text-sm">Name</p>
      <input v-model="keyboardStore.name" type="text" class="input input-bordered w-full" />
    </div>
    <div class="mb-4">
      <p class="mb-2 text-sm">Manufacturer (optional)</p>
      <input v-model="keyboardStore.manufacturer" type="text" class="input input-bordered w-full" />
    </div>
    <div class="mb-4">
      <p class="mb-2 text-sm">Description (optional)</p>
      <textarea
        v-model="keyboardStore.description"
        type="text"
        class="textarea textarea-bordered w-full"
      />
    </div>
    <div class="mb-4">
      <p class="mb-2 text-sm">Tags (optional)</p>
      <VueMultiselect
        v-model="keyboardStore.tags"
        :options="keyboardTags"
        :multiple="true"
        :taggable="true"
        class="w-full"
        @tag="addTag"
      >
      </VueMultiselect>
    </div>
    <div class="mt-8 flex justify-center">
      <button v-if="initialSetup" class="btn btn-primary" @click="$emit('next')">next</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from '../store'
import VueMultiselect from 'vue-multiselect'
defineProps(['initialSetup'])
const keyboardTags = ['65%']

const addTag = (tag) => {
  console.log(tag)
  keyboardStore.tags.push(tag)
}
</script>

<style lang="scss">
@import 'vue-multiselect/dist/vue-multiselect.css';
.multiselect__tags {
  width: 100%;
  background: transparent;
  border: none;
}
.multiselect__placeholder {
  background: transparent;
}
</style>
