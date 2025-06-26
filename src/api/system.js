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
