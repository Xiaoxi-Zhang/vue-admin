import request from '@/utils/request'

/**
 * 获取角色列表
 * @export
 * @return {*}
 */
export function getRoleListAPI() {
  return request({
    url: '/park/sys/role'
  })
}

/**
 * 获取tree权限列表
 * @export
 * @return {*}
 */
export function getTreeListAPI() {
  return request({
    url: '/park/sys/permision/all/tree'
  })
}

/**
 * 获取当前角色权限点列表
 * @export
 * @param {string} roleId - 角色ID
 * @return {*}
 */
export function getRoleDetailAPI(roleId) {
  return request({
    url: `/park/sys/role/${roleId}`
  })
}

/**
 * 获取当前角色下的成员列表
 * @export
 * @param {string} roleId - 角色ID
 * @return {*}
 */
export function getRoleUserListAPI(roleId, params) {
  return request({
    url: `/park/sys/roleUser/${roleId}`,
    params
  })
}

/**
 * 创建角色
 * @export
 * @param {} data
 * @return {*}
 */
export function createRoleUserAPI(data) {
  return request({
    url: '/park/sys/role',
    method: 'POST',
    data
  })
}

/**
 * 更改角色权限
 * @export
 * @param {*} data
 * @return {*}
 */
export function updateRoleAPI(data) {
  return request({
    url: `/park/sys/role`,
    method: 'PUT',
    data
  })
}

/**
 * 删除角色用户
 * @export
 * @param {*} id
 * @return
 */
export function delRoleUserAPI(id) {
  return request({
    url: `/park/sys/role/${id}`,
    method: 'DELETE'
  })
}
