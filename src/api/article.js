import request from '@/utils/request'

// * 文章分类
export const channelDeleteService = (id) =>
  // 或者 `/my/article/${id}`
  request.delete('/my/cate/del', { params: { id } })

export const channelGetInfoService = (id) =>
  request.get('/my/cate/info', { params: { id } })

export const channelUpdateService = (data) => request.put('/my/cate/info', data)

export const channelAddService = (data) => request.post('/my/cate/add', data)

export const channelGetService = () => request.get('/my/cate/list')

// * 文章管理
// 更新文章详情
export const articleUpdateService = (data) =>
  request.put('/my/article/info', data)

// 发布文章
export const articlePublishService = (data) =>
  request.post('/my/article/add', data)

// 获取文章详情
export const articleGetInfoService = (id) =>
  request.get('/my/article/info', { params: { id } })

// 删除文章
export const articleDeleteService = (id) =>
  request.delete('/my/article/info', { params: { id } })

// 获取文章列表
export const articleGetListService = (params) =>
  request.get('/my/article/list', { params })
