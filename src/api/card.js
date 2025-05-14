import request from '@/utils/request'

/**
 * 获取月卡列表
 * @export
 * @param {*} params
 * @return {*}
 */
export function getCardListAPI(params) {
  return request({
    url: '/parking/card/list',
    method: 'GET',
    params: params
  })
}
