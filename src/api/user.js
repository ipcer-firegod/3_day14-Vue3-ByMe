import request from '@/utils/request'

export const userRegisterService = (data) => request.post('/api/reg', data)

export const userLoginService = (data) => request.post('/api/login', data)
