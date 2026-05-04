import request from './request'

// ==========================
// 论坛帖子 API
// ==========================

// 1. 前台帖子列表（只查正常状态 + 支持搜索）
export function getPostList(params) {
  return request({
    url: '/forumPost/list',
    method: 'get',
    params
  })
}

// 2. 帖子详情
export function getPostDetail(id) {
  return request({
    url: `/forumPost/${id}`,
    method: 'get'
  })
}

// 3. 发布帖子
export function createPost(data) {
  return request({
    url: '/forumPost/create',
    method: 'post',
    data
  })
}

// 4. 修改帖子
export function updatePost(data) {
  return request({
    url: '/forumPost/update',
    method: 'put',
    data
  })
}

// 5. 删除帖子
export function deletePost(id) {
  return request({
    url: `/forumPost/delete/${id}`,
    method: 'delete'
  })
}

// 6. 获取回复列表
export function getReplies(parentId) {
  return request({
    url: `/forumPost/replies/${parentId}`,
    method: 'get'
  })
}

// 7. 后台帖子管理列表（超管 + 联表 realName）
export function getAdminPostList(params) {
  return request({
    url: '/forumPost/admin/list',
    method: 'get',
    params
  })
}

// 8. 管理员修改帖子状态（禁用/正常/待审核）
export function updatePostStatus(postId, status) {
  return request({
    url: '/forumPost/admin/updateStatus',
    method: 'put',
    params: {
      postId,
      status
    }
  })
}