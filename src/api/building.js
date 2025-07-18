import request from '@/utils/request'

/**
 * 获取楼宇列表
 * @export
 * @param {*} params
 * @returns
 */
export function getBuildingListAPI(params) {
  return request({
    url: '/park/building',
    params
  })
}

/**
 * 添加楼宇
 * @export
 * @param {*} data
 * @returns
 */
export function createBuildingListAPI(data) {
  return request({
    url: '/park/building',
    method: 'POST',
    data
  })
}

/**
 * 删除楼宇
 * @export
 * @param {*} id
 * @returns
 */
export function delBuildingListAPI(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'DELETE'
  })
}
