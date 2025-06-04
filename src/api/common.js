import request from '@/utils/request'

/**
 * 上传文件
 * @export
 * @param {*} form 参数
 * @return {*}
 */
export function uploadFileAPI(form) {
  return request({
    url: '/upload',
    method: 'POST',
    data: form
  })
}
