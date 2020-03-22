import request from '@/utils/request'
import { genParam } from '@/utils/encrypt'

export function getList(params) {
  const paramStr = genParam(params)

  return request({
    url: '/admin/alibabacategory/list',
    method: 'get',
    params
  })
}

export function createAlibabaCategory(param) {
  // console.log(param)
  const paramStr = genParam(param)
  // console.log(paramStr)

  return request({
    url: '/admin/alibabacategory/create',
    method: 'post',
    data: paramStr
  })
}

export function editAlibabaCategory(param) {
  const params = {
    name: param.name,
    publishing: param.publishing,
    stats: param.stats,
    parent: param.parent
  }
  const paramStr = genParam(params)

  return request({
    url: '/admin/alibabacategory/' + param.id + '/edit',
    method: 'put',
    data: paramStr
  })
}

export function deleteAlibabaCategory(param) {
  return request({
    url: '/admin/alibabacategory/' + param.id + '/delete',
    method: 'delete'
  })
}
