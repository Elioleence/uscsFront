import request from './request'

export function getClubList(params) {
  return request.get('/clubInfo/list', { params })
}

export function getClubInfo(clubId) {
  return request.get(`/clubInfo/${clubId}`)
}

export function createClub(data) {
  return request.post('/clubInfo/create', data)
}

export function updateClub(data) {
  return request.put('/clubInfo/update', data)
}

export function deleteClub(clubId) {
  return request.delete(`/clubInfo/delete/${clubId}`)
}

export function getClubApplyList(params) {
  return request.get('/clubApply/list', { params })
}

export function submitClubApply(data) {
  return request.post('/clubApply/submit', data)
}

export function checkClubApplyStatus(clubId) {
  return request.get(`/clubApply/checkStatus/${clubId}`)
}

export function auditClubApply(applyId, auditStatus, auditReply = '') {
  return request({
    url: `/clubApply/audit/${applyId}`,
    method: 'put',
    params: {
      auditStatus: auditStatus,
      auditReply: auditReply
    }
  })
}

export function getClubAchievementList(params) {
  return request.get('/clubAchievement/list', { params })
}

export function getPublicAchievementList(params) {
  return request.get('/clubAchievement/public/list', { params })
}

export function createAchievement(data) {
  return request.post('/clubAchievement/create', data)
}

export function updateAchievement(data) {
  return request.put('/clubAchievement/update', data)
}

export function deleteAchievement(id) {
  return request.delete(`/clubAchievement/delete/${id}`)
}

export function getAchievementDetail(id) {
  return request.get(`/clubAchievement/public/${id}`)
}