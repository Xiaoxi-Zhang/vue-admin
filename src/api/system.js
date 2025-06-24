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
