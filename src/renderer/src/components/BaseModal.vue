<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="props.open"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      @click.self="$emit('close')"
    >
      <div
        class="relative w-full max-w-md rounded-2xl border border-gray-200/20 bg-base-100/80 p-8 shadow-2xl backdrop-blur-md"
      >
        <h3 v-if="props.title" class="mb-2 text-xl font-semibold">{{ props.title }}</h3>
        <div class="py-2">
          <slot />
        </div>
        <div class="mt-6 flex items-center justify-end gap-2">
          <button class="btn justify-self-start" @click="$emit('close')">
            {{ props.cancelText }}
          </button>
          <button
            v-if="props.secondaryText"
            class="btn btn-primary justify-self-center"
            @click="$emit('secondary')"
          >
            {{ props.secondaryText }}
          </button>
          <div v-else></div>
          <button
            v-if="props.showConfirm && props.confirmText"
            class="btn btn-primary justify-self-end"
            @click="$emit('confirm')"
          >
            {{ props.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
  confirmText?: string
  cancelText?: string
  secondaryText?: string
  showConfirm?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  confirmText: '',
  cancelText: 'Cancel',
  secondaryText: '',
  showConfirm: true
})

defineEmits<{
  close: []
  confirm: []
  secondary: []
}>()
</script>
