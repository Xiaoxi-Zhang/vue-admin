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

/**
 * 添加租赁合同
 * @export
 * @param {*} data
 * @return {*}
 */
export function addRentAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}

/**
 * 获取展开的租赁合同详情
 * @export
 * @param {*} id 企业id
 * @return {*}
 */
export function getEnterpriseRentBuildingAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`
  })
}

/**
 * 退租
 * @export
 * @param {*} id 租赁合同的id
 * @return {*}
 */
export function rentingOutAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'PUT'
  })
}

/**
 * 删除租赁合同
 * @export
 * @param {*} id 租赁合同id
 * @return
 */
export function delRentAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'DELETE'
  })
}
