import request from '@/utils/request'

// 工作台基础信息查询
export function getWorkbenchInfo() {
  return request({
    url: '/home/workbench/info'
  })
}
// 临期合同查询
export function getRentInfo(params) {
  return request({
    url: '/home/workbench/rentInfo',
    params
  })
}
