import request from './request'

// ==========================
// 活动签到 API
// ==========================

// 1. 用户签到
export function checkIn(data) {
  return request({
    url: '/activitySign/checkin',
    method: 'post',
    data
  })
}

// 2. 管理员获取签到列表（带联表：活动名称 + 真实姓名）
export function getSignList(params) {
  return request({
    url: '/activitySign/list',
    method: 'get',
    params
  })
}

// 3. 获取我的签到记录
export function getMySigns(params) {
  return request({
    url: '/activitySign/mySigns',
    method: 'get',
    params
  })
}

// 4. 获取某个活动的签到人数
export function getActivitySignCount(actId) {
  return request({
    url: `/activitySign/activitySignCount/${actId}`,
    method: 'get'
  })
}