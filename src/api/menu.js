import request from '@/utils/request'
import { genParam } from '@/utils/encrypt'

export function getList(params) {
  const paramStr = genParam(params)

  return request({
    url: '/admin/menu/list',
    method: 'get',
    params
  })
}

export function createMenu(param) {
  // console.log(param)
  const params = {
    name: param.name,
    parent: param.parent,
    type: param.display === '1' && param.is_operation === '0' ? 0 : 1,
    url: param.url
  }
  const paramStr = genParam(params)
  // console.log(paramStr)

  return request({
    url: '/admin/menu/create',
    method: 'post',
    data: paramStr
  })
}

export function editMenu(param) {
  const params = {
    name: param.name,
    parent: param.parent,
    type: param.display === '1' && param.is_operation === '0' ? 1 : 0,
    url: param.url
  }
  const paramStr = genParam(params)

  return request({
    url: '/admin/menu/' + param.id + '/edit',
    method: 'put',
    data: paramStr
  })
}

export function deleteMenu(param) {
  return request({
    url: '/admin/menu/' + param.id + '/delete',
    method: 'delete'
  })
}
