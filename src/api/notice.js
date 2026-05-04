import request from './request'

export function getNoticeList(params) {
  return request.get('/sysNotice/list', { params })
}

export function getNoticeDetail(noticeId) {
  return request.get(`/sysNotice/detail/${noticeId}`)
}

export function createNotice(data) {
  return request.post('/sysNotice/create', data)
}

export function updateNotice(data) {
  return request.put('/sysNotice/update', data)
}

export function deleteNotice(noticeId) {
  return request.delete(`/sysNotice/delete/${noticeId}`)
}