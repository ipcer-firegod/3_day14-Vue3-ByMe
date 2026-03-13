import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')

    const setToken = (tokenValue) => {
      token.value = tokenValue
    }
    const removeToken = () => {
      token.value = ''
    }

    return { token, setToken, removeToken }
  },
  {
    persist: true
  }
)
