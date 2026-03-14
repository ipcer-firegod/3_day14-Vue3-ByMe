import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

// 使用自定义配置新建一个 axios 实例
// axios.create(config) 这个方法会返回一个新的 axios 实例，这个实例和 axios 的功能一样，但是可以有自己的配置。
const instance = axios.create({
  // TODO 1. 基础地址，超时时间
  baseURL,
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // TODO 2. 携带token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    // TODO 3. 摘取核心响应数据 如果返回码为 0 代表业务成功
    if (response.data.code === 0) {
      return response
    }
    // TODO 4. 处理业务失败
    ElMessage.error(response.data.message || '服务异常')
    return Promise.reject(response.data)
  },
  function (error) {
    // 对响应错误做点什么
    // TODO 5. 处理401错误
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (error.response?.status === 401) {
      router.push('/login')
      // * 或者使用name方式跳转
      // router.push({ name: 'login' })
    }

    // 错误的默认情况 => 只要给提示
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message || '服务异常')
    }
    return Promise.reject(error)
  }
)

// 默认导出这个实例，其他模块就可以直接使用这个实例进行网络请求了。
// 其他模块接受的代码为：import request from '@/utils/request'，不必使用instance这个名字了，直接使用request就可以了。
export default instance
export { baseURL }
