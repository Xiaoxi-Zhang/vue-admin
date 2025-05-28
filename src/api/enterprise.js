import request from '@/utils/request'

/**
 * 获取企业列表
 * @param {*} params 参数
 * @return {*}
 */
export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    params
  })
}
