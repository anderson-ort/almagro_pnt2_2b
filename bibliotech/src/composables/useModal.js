import { ref } from 'vue'

export function useModal() {
  const isOpen = ref(false)
  const data = ref(null)

  function open(initialData = null) {
    data.value = initialData
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
    data.value = null
  }

  function toggle() {
    isOpen.value ? close() : open()
  }

  return {
    isOpen,
    data,
    open,
    close,
    toggle
  }
}