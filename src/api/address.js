import request from '@/utils/request'
import { genParam, signature } from '@/utils/encrypt'
import { Message } from 'element-ui'

export function getList(params) {
  const paramStr = genParam(params)

  console.log(paramStr)

  return request({
    url: '/admin/address/list',
    method: 'get',
    params
  })
}

export function editAddress(params) {
  const param = {}
  if (params.is_default !== undefined) {
    param.is_default = params.is_default
  }

  if (param) {
    const paramStr = genParam(param)

    return request({
      url: '/admin/address/' + params.id + '/edit',
      method: 'put',
      data: paramStr
    })
  } else {
    Message.error('不需要修改会员收货地址')
  }
}
