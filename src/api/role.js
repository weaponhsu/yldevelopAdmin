import request from '@/utils/request'
import { genParam } from '@/utils/encrypt'

export function getList(params) {
  const paramStr = genParam(params)

  return request({
    url: '/admin/role/list',
    method: 'get',
    params
  })
}

export function getAccessList(params) {
  const paramStr = genParam(params)
  return request({
    url: '/admin/access/list',
    method: 'get',
    params
  })
}

export function createRole(param) {
  // console.log(param)
  const paramStr = genParam(param)
  // console.log(paramStr)

  return request({
    url: '/admin/role/create',
    method: 'post',
    data: paramStr
  })
}

export function editRole(param) {
  const params = {
    name: param.name,
    access: param.access
  }
  const paramStr = genParam(params)

  return request({
    url: '/admin/role/' + param.id + '/edit',
    method: 'put',
    data: paramStr
  })
}

export function deleteRole(param) {
  return request({
    url: '/admin/role/' + param.id + '/delete',
    method: 'delete'
  })
}
