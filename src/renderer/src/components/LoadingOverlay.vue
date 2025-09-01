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
      v-if="props.isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        class="relative w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-md"
      >
        <!-- Spinner -->
        <div class="mb-6 flex justify-center">
          <div class="relative">
            <div class="h-16 w-16 rounded-full border-4 border-white/20"></div>
            <div
              class="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"
            ></div>
          </div>
        </div>
        <!-- Text -->
        <div class="text-center text-white">
          <h3 class="mb-2 text-xl font-semibold">{{ props.title }}</h3>
          <p class="text-sm text-white/80">{{ props.message }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  isVisible: boolean
  title?: string
  message?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Processing',
  message: 'Please wait...'
})
</script>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
