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
