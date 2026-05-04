import request from './request'
export function getAdminActivityList(params) {
  return request({
    url: '/activityInfo/admin/list',
    method: 'get',
    params
  })
}
export function getActivityList(params) {
  return request.get('/activityInfo/list', { params })
}

export function getActivityInfo(id) {
  return request.get(`/activityInfo/${id}`)
}

export function createActivity(data) {
  return request.post('/activityInfo/create', data)
}

export function updateActivity(data) {
  return request.put('/activityInfo/update', data)
}

export function deleteActivity(id) {
  return request.delete(`/activityInfo/delete/${id}`)
}

export function getActivityEnrollList(params) {
  return request.get('/activityEnroll/list', { params })
}

export function auditActivityEnroll(data) {
  return request.post('/activityEnroll/audit', data)
}

export function getActivitySignList(params) {
  return request.get('/activitySign/list', { params })
}

export function signActivity(data) {
  return request.post('/activityEnroll/submit', data)
}

export function checkEnrollStatus(actId) {
  return request.get('/activityEnroll/myEnrolls', {
    params: { actId, pageNum: 1, pageSize: 1 }
  })
}