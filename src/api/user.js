import request from '@/utils/request'

export const userRegisterService = (data) => request.post('/api/reg', data)

export const userLoginService = (data) => request.post('/api/login', data)

// 获取用户基本信息
export const userGetInfoService = () => request.get('/my/userinfo')

// 更新用户基本信息
export const userUpdateInfoService = (data) => request.put('/my/userinfo', data)

// 更新用户头像
// 注意这里参数和使用时相差一个层级，因为使用时是 { avatar: 'base64字符串' }
export const userUpdateAvatarService = (avatar) =>
  request.patch('/my/update/avatar', { avatar })

// 更新用户密码
export const userUpdatePwdService = (data) =>
  request.patch('/my/updatepwd', data)
