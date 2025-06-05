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
