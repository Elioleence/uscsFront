import request from './request'

export function login(data) {
  return request.post('/login', data)
}

export function getUserInfo(userId) {
  return request.get(`/sysUser/info/${userId}`)
}

export function getUserInfoByUsername(username) {
  return request.get('/sysUser/info', { params: { username } })
}