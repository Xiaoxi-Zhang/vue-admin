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
