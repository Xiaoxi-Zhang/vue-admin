// request 就是axios.create() 创建的实例
import request from '@/utils/request'

// 登录函数
// export 导出的目的 让组件使用
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function loginAPI (data) {
  // request 返回的是 Promise结果
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}
