import request from './request'

export function getForumPostList(params) {
  return request.get('/forumPost/list', { params })
}

export function getForumPostDetail(id) {
  return request.get(`/forumPost/${id}`)
}

export function createForumPost(data) {
  return request.post('/forumPost/create', data)
}

export function updateForumPost(data) {
  return request.put('/forumPost/update', data)
}

export function deleteForumPost(id) {
  return request.delete(`/forumPost/delete/${id}`)
}

export function auditForumPost(data) {
  return request.post('/forumPost/audit', data)
}