import request from '@/utils/request'
import { genParam } from '@/utils/encrypt'

export function getWithdrawList(params) {
  genParam(params)

  return request({
    url: '/admin/withdraw/list',
    method: 'get',
    params
  })
}

export function getIntegralList(params) {
  genParam(params)

  return request({
    url: '/admin/integral/list',
    method: 'get',
    params
  })
}

export function getBalanceList(params) {
  genParam(params)

  return request({
    url: '/admin/balance/list',
    method: 'get',
    params
  })
}

export function editWithdraw(param) {
  const params = {
    stats: param.stats
  }
  const paramStr = genParam(params)

  return request({
    url: '/admin/withdraw/' + param.id + '/edit',
    method: 'put',
    data: paramStr
  })
}
