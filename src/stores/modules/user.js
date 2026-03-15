import { ref } from 'vue'
import { defineStore } from 'pinia'
import { userGetInfoService } from '@/api/user'

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

    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data.data
    }
    const setUser = (userInfo) => {
      user.value = userInfo
    }

    return { token, setToken, removeToken, user, getUser, setUser }
  },
  {
    persist: true
  }
)
