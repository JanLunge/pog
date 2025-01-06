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
    
    <div class="mb-4">
      <p class="mb-2 text-sm">Keyboard Features</p>
      <VueMultiselect
        v-model="keyboardStore.kbFeatures"
        :options="availableFeatures"
        :multiple="true"
        class="w-full"
      >
        <template #option="{ option }">
          <span>{{ formatFeatureName(option) }}</span>
        </template>
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

const availableFeatures = [
  'basic',
  'serial',
  'oneshot',
  'tapdance',
  'holdtap',
  'mousekeys',
  'combos',
  'macros',
  'capsword',
  'international'
]

const formatFeatureName = (feature: string) => {
  return feature.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
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
.multiselect__option--selected.multiselect__option {
  background: #674848;
}
.multiselect__option {
  background: #252525;
  color: #fff;
  &:hover {
    background: #353535;
  }
}
</style>
