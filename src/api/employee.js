import request from '@/utils/request'

/**
 * 获取员工列表
 * @export
 * @param {*} params
 * @returns
 */
export function getEmployeeListAPI(params) {
  return request({
    url: '/park/sys/user',
    params
  })
}
