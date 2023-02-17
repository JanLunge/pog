<template>
  <div class="mt-8">
    <div class="mb-4">
      <p class="mb-2 text-sm">Name</p>
      <input v-model="keyboardStore.name" type="text" class="input-bordered input" />
    </div>
    <div class="mb-4">
      <p class="mb-2 text-sm">Manufacturer</p>
      <input v-model="keyboardStore.manufacturer" type="text" class="input-bordered input" />
    </div>
    <div class="mb-4">
      <p class="mb-2 text-sm">Description</p>
      <input v-model="keyboardStore.description" type="text" class="input-bordered input" />
    </div>
    <div class="mb-4">
      <p class="mb-2 text-sm">Tags</p>
      <Multiselect
        v-model="keyboardStore.tags"
        mode="tags"
        :searchable="true"
        :create-option="false"
        :options="keyboardTags"
        :close-on-select="false"
        track-by="name"
        label="name"
      >
        <template #tag="{ option, handleTagRemove, disabled }">
          <div
            class="multiselect-tag is-user"
            :class="{
              'is-disabled': disabled
            }"
          >
            {{ option.name }}
            <span
              v-if="!disabled"
              class="multiselect-tag-remove"
              @mousedown.prevent="handleTagRemove(option, $event)"
            >
              <span class="multiselect-tag-remove-icon"></span>
            </span>
          </div>
        </template>
      </Multiselect>
    </div>
    <div class="flex justify-center mt-8">
      <button v-if="initialSetup" class="btn-primary btn" @click="$emit('next')">next</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { keyboardStore } from '../store'
import { computed } from 'vue'
import Multiselect from '@vueform/multiselect'

const props = defineProps(['initialSetup'])
const keyboardTags = [{ value: '65%', name: '65%', type: 'formfactor' }]

const infoComplete = computed(() => {
  return keyboardStore.name !== ''
})
</script>

<style lang="scss" scoped></style>
