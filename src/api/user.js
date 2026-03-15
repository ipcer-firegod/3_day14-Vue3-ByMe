import request from '@/utils/request'

export const userRegisterService = (data) => request.post('/api/reg', data)

export const userLoginService = (data) => request.post('/api/login', data)

// 获取用户基本信息
export const userGetInfoService = () => request.get('/my/userinfo')

// 更新用户基本信息
export const userUpdateInfoService = (data) => request.put('/my/userinfo', data)

// 更新用户头像
export const userUpdateAvatarService = (data) =>
  request.patch('/my/update/avatar', data)

// 更新用户密码
export const userUpdatePwdService = (data) =>
  request.patch('/my/updatepwd', data)
