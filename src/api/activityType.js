import request from './request'

// 获取活动类型列表
export function getActivityTypeList() {
  return request({
    url: '/activityType/list',
    method: 'get'
  })
}