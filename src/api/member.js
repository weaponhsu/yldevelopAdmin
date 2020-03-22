import request from '@/utils/request'
import { genParam, signature } from '@/utils/encrypt'

export function getList(params) {
  const paramStr = genParam(params)

  return request({
    url: '/admin/member/list',
    method: 'get',
    params
  })
}

export function editMember(params) {
  const param = {}
  if (params.mobile !== undefined) {
    param.mobile = params.mobile
  }
  if (params.role !== undefined) {
    param.role = params.role
  }
  if (params.stats !== undefined) {
    param.stats = params.stats
  }
  if (params.google_secret !== undefined) {
    param.google_secret = params.google_secret
  }
  if (params.password !== undefined) {
    param.password = params.password
  }
  const paramStr = genParam(param)

  return request({
    url: '/admin/member/' + params.id + '/edit',
    method: 'put',
    data: paramStr
  })
}
