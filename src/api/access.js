import request from '@/utils/request'
import { genParam } from '@/utils/encrypt'

export function getList(params) {
  const paramStr = genParam(params)

  return request({
    url: '/admin/access/list',
    method: 'get',
    params
  })
}

export function getAccessList(params) {
  const paramStr = genParam(params)
  return request({
    url: '/admin/rule/list',
    method: 'get',
    params
  })
}

export function createAccess(param) {
  const params = {
    name: param.name,
    menu_id: param.access
  }
  const paramStr = genParam(params)
  // console.log(paramStr)

  return request({
    url: '/admin/access/create',
    method: 'post',
    data: paramStr
  })
}

export function editAccess(param) {
  const params = {
    name: param.name,
    menu_id: param.access
  }
  const paramStr = genParam(params)

  return request({
    url: '/admin/access/' + param.id + '/edit',
    method: 'put',
    data: paramStr
  })
}

export function deleteAccess(param) {
  return request({
    url: '/admin/access/' + param.id + '/delete',
    method: 'delete'
  })
}
