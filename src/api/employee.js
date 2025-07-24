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

/**
 * 添加员工
 * @export
 * @param {*} data
 * @returns
 */
export function addEmployeeAPI(data) {
  return request({
    url: '/park/sys/user',
    method: 'POST',
    data
  })
}
