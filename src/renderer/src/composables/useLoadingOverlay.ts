import { ref, onMounted, onUnmounted } from 'vue'
import { onLoadingChange, hideLoading } from '../helpers/saveConfigurationWrapper'

export const useLoadingOverlay = () => {
  const isLoading = ref(false)
  let fallbackTimeout: number | null = null

  const hideLoadingOverlay = () => {
    if (fallbackTimeout) {
      clearTimeout(fallbackTimeout)
      fallbackTimeout = null
    }
    hideLoading()
  }

  const setupFallbackTimeout = (timeoutMs = 15000) => {
    if (fallbackTimeout) {
      clearTimeout(fallbackTimeout)
    }
    fallbackTimeout = setTimeout(() => {
      if (isLoading.value) {
        hideLoadingOverlay()
      }
    }, timeoutMs) as unknown as number
  }

  // Watch for loading state changes
  const unwatchLoading = onLoadingChange((loading) => {
    isLoading.value = loading
  })

  onMounted(() => {
    // Set up fallback timeout when component mounts and loading is active
    if (isLoading.value) {
      setupFallbackTimeout()
    }
  })

  onUnmounted(() => {
    unwatchLoading()
    if (fallbackTimeout) {
      clearTimeout(fallbackTimeout)
      fallbackTimeout = null
    }
  })

  return {
    isLoading,
    hideLoadingOverlay,
    setupFallbackTimeout
  }
}
