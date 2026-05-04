import request from './request'

// ==========================================
// 1. 提交退社申请
// ==========================================
export function submitQuit(data) {
  return request({
    url: '/clubQuit/submit',
    method: 'post',
    data
  })
}

// ==========================================
// 2. 分页获取退社申请列表（管理员用）
// ==========================================
export function getQuitList(params) {
  return request({
    url: '/clubQuit/list',
    method: 'get',
    params
  })
}

// ==========================================
// 3. 审核退社申请
// ==========================================
export function auditQuit(quitId, auditStatus, auditReply) {
  return request({
    url: `/clubQuit/audit/${quitId}`,
    method: 'put',
    params: {
      auditStatus,
      auditReply
    }
  })
}

// ==========================================
// 4. 管理员删除退社申请
// ==========================================
export function deleteQuit(quitId) {
  return request({
    url: `/clubQuit/delete/${quitId}`,
    method: 'delete'
  })
}

// ==========================================
// 5. 获取“我的退社申请”列表
// ==========================================
export function getMyQuits(params) {
  return request({
    url: '/clubQuit/myQuits',
    method: 'get',
    params
  })
}

// ==========================================
// 6. 取消自己的退社申请
// ==========================================
export function cancelQuit(quitId) {
  return request({
    url: `/clubQuit/cancel/${quitId}`,
    method: 'delete'
  })
}