import request from './request'

export function getUserList(params) {
  return request.get('/sysUser/admin/list', { params })
}
// 获取用户下拉列表（无分页）
export function getUserSelectList() {
  return request.get('/sysUser/selectList')
}

export function createUser(data) {
  return request.post('/sysUser/admin/create', data)
}

// 更新个人用户信息接口
export function updateUser(data) {
  return request.put('/sysUser/update', data)
}

export function deleteUser(userId) {
  return request.delete(`/sysUser/admin/delete/${userId}`)
}

export function updatePassword(data) {
  return request.post('/sysUser/updatePassword', data)
}