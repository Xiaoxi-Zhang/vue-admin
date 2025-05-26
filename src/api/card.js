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

/**
 * 添加月卡
 * @export
 * @param {*} data 参数
 * @return {*}
 */
export function addCardAPI(data) {
  return request({
    url: '/parking/card',
    method: 'POST',
    data: data
  })
}

/**
 * 获取月卡详情
 * @export
 * @param {*} id 月卡id
 * @return {*}
 */
export function getCardDetailAPI(id) {
  return request({
    url: `/parking/card/detail/${id}`
  })
}

/**
 * 编辑月卡
 * @export
 * @param {*} data 参数
 * @return {*}
 */
export function editCardAPI(data) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}

/**
 * 删除月卡
 * @export
 * @param {*} id 月卡id
 * @return {*}
 */
export function deleteCardAPI(id) {
  return request({
    url: `/parking/card/${id}`,
    method: 'DELETE'
  })
}
