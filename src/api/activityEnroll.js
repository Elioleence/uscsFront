import request from './request'

// ==========================
// 活动报名相关 API
// ==========================

// 1. 提交活动报名
export function submitEnroll(data) {
  return request({
    url: '/activityEnroll/submit',
    method: 'post',
    data
  })
}

// 2. 管理员获取报名列表（带联表查询）
export function getEnrollList(params) {
  return request({
    url: '/activityEnroll/list',
    method: 'get',
    params
  })
}

// 3. 管理员审核报名
export function auditEnroll(enrollId, auditStatus, auditReply) {
  return request({
    url: `/activityEnroll/audit/${enrollId}`,
    method: 'put',
    params: {
      auditStatus,
      auditReply
    }
  })
}

// 4. 管理员删除报名
export function deleteEnroll(enrollId) {
  return request({
    url: `/activityEnroll/delete/${enrollId}`,
    method: 'delete'
  })
}

// 5. 获取我的报名列表
export function getMyEnrolls(params) {
  return request({
    url: '/activityEnroll/myEnrolls',
    method: 'get',
    params
  })
}

// 6. 取消我的报名
export function cancelEnroll(enrollId) {
  return request({
    url: `/activityEnroll/cancel/${enrollId}`,
    method: 'delete'
  })
}