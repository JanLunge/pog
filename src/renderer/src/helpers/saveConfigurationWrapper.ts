import { ref } from 'vue'

// Global loading state
const isLoading = ref(false)
const loadingCallbacks = new Set<(loading: boolean) => void>()

// Subscribe to loading state changes
export const onLoadingChange = (callback: (loading: boolean) => void) => {
  const unwatch = () => {
    loadingCallbacks.delete(callback)
  }
  loadingCallbacks.add(callback)
  return unwatch
}

// Get current loading state
export const getLoadingState = () => isLoading.value

// Set loading state and notify all callbacks
const setLoading = (loading: boolean) => {
  isLoading.value = loading
  loadingCallbacks.forEach((callback) => callback(loading))
}

// Wrapper for saveConfiguration that automatically handles loading overlay
export const saveConfigurationWithLoading = async (data: string) => {
  if (isLoading.value) {
    console.warn('Save operation already in progress, ignoring duplicate call')
    return
  }

  try {
    setLoading(true)
    await window.api.saveConfiguration(data)
  } catch (error) {
    console.error('Error in saveConfigurationWithLoading:', error)
    throw error
  } finally {
    // Don't set loading to false here - let the LoadingOverlay handle it
    // based on the progress events from the main process
  }
}

// Function to manually hide loading (for fallback timeouts)
export const hideLoading = () => {
  setLoading(false)
}
