import request from './request'

export function getRoleList(params) {
  return request.get('/sysRole/list', { params })
}

export function createRole(data) {
  return request.post('/sysRole/create', data)
}

export function updateRole(data) {
  return request.put('/sysRole/update', data)
}

export function deleteRole(roleId) {
  return request.delete(`/sysRole/delete/${roleId}`)
}