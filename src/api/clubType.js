import request from './request'

export function getTypeList() {
  return request.get('/clubType/list')
}

export function getTypeDetail(typeId) {
  return request.get(`/clubType/${typeId}`)
}

export function createType(data) {
  return request.post('/clubType/create', data)
}

export function updateType(data) {
  return request.put('/clubType/update', data)
}

export function deleteType(typeId) {
  return request.delete(`/clubType/delete/${typeId}`)
}