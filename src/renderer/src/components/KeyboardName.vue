<template>
  <div class="mt-8">
    <div class="mb-4">
      <p class="mb-2 text-sm">Name</p>
      <input v-model="keyboardStore.name" type="text" class="input-bordered input w-full" />
    </div>
    <div class="mb-4">
      <p class="mb-2 text-sm">Manufacturer</p>
      <input v-model="keyboardStore.manufacturer" type="text" class="input-bordered input w-full" />
    </div>
    <div class="mb-4">
      <p class="mb-2 text-sm">Description</p>
      <textarea v-model="keyboardStore.description" type="text" class="textarea-bordered textarea w-full" />
    </div>
    <div class="mb-4">
      <p class="mb-2 text-sm">Tags</p>
      <VueMultiselect
        v-model="keyboardStore.tags"
        :options="keyboardTags"
        :multiple="true"
        :taggable="true"
        @tag="addTag"
      >
      </VueMultiselect>
    </div>
    <div class="flex justify-center mt-8">
      <button v-if="initialSetup" class="btn-primary btn" @click="$emit('next')">next</button>
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

<style lang="scss" >
@import 'vue-multiselect/dist/vue-multiselect.css'
</style>
