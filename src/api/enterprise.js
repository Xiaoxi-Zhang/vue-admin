import request from '@/utils/request'

/**
 * 获取企业列表
 * @export
 * @param {*} params 参数
 * @return {*}
 */
export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    params
  })
}

/**
 * 获取所属行业列表
 * @export
 * @return {*}
 */
export function getIndustryListAPI() {
  return request({
    url: '/park/industry'
  })
}

/**
 * 添加企业
 * @export
 * @param {*} data 参数
 * @return {*}
 */
export function addEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'POST',
    data
  })
}

/**
 * 获取企业详情
 * @export
 * @param {*} id
 * @return {*}
 */
export function getEnterpriseDetailAPI(id) {
  return request({
    url: `park/enterprise/${id}`
  })
}

/**
 * 更新企业信息
 * @export
 * @param {*} data
 * @return {*}
 */
export function updateEnterpriseAPI(data) {
  return request({
    url: 'park/enterprise',
    method: 'PUT',
    data
  })
}

/**
 * 删除企业
 * @export
 * @param {*} id 企业ID
 * @return {*}
 */
export function deleteEnterpriseAPI(id) {
  return request({
    url: `park/enterprise/${id}`,
    method: 'DELETE'
  })
}

/**
 * 获取租赁楼宇列表
 * @export
 * @return {*}
 */
export function getRentBuildingAPI() {
  return request({
    url: '/park/rent/building'
  })
}
