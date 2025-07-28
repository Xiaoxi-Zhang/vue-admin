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

/**
 * 删除员工
 * @export
 * @param {*} id
 * @returns
 */
export function delEmployeeAPI(id) {
  return request({
    url: `/park/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 * 更编辑员工信息
 * @export
 * @param {*} data
 * @returns
 */
export function updateEmployeeAPI(data) {
  return request({
    url: '/park/sys/user',
    method: 'PUT',
    data
  })
}

/**
 * 重置员工密码
 * @export
 * @param {*} data
 * @returns
 */
export function resetEmployeePwdAPI(data) {
  return request({
    url: '/park/sys/user/resetPwd',
    method: 'PUT',
    data
  })
}
