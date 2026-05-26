import { reactive, ref } from 'vue'

export function useForm(initialValues = {}, onSubmit) {
  const values = reactive({ ...initialValues })
  const errors = reactive({})
  const loading = ref(false)
  const submitted = ref(false)

  function setField(field, value) {
    values[field] = value
    if (errors[field]) errors[field] = ''
  }

  function setError(field, message) {
    errors[field] = message
  }

  function reset(newValues = {}) {
    Object.assign(values, { ...initialValues, ...newValues })
    Object.keys(errors).forEach(k => errors[k] = '')
    submitted.value = false
  }

  async function submit(e) {
    if (e) e.preventDefault()
    submitted.value = true
    if (!onSubmit) return

    loading.value = true
    try {
      await onSubmit({ ...values })
    } catch (err) {
      if (err.response?.data?.errors) {
        Object.assign(errors, err.response.data.errors)
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    values,
    errors,
    loading,
    submitted,
    setField,
    setError,
    reset,
    submit
  }
}