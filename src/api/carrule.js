import request from '@/utils/request'

/**
 * 获取计费规则列表
 * @export
 * @param {*} params
 * @return {*}
 */
export function getRuleListAPI(params) {
  return request({
    url: '/parking/rule/list',
    params
  })
}

/**
 * 增加计费规则
 * @export
 * @param {*} data
 * @return {*}
 */
export function addFeeRuleAPI(data) {
  return request({
    url: '/parking/rule',
    method: 'POST',
    data
  })
}

/**
 * 删除计费规则
 * @export
 * @param {*} id
 * @return {*}
 */
export function deleteFeeRuleAPI(id) {
  return request({
    url: `/parking/rule/${id}`,
    method: 'DELETE'
  })
}
