import request from '@/utils/request'
import { genParam, signature } from '@/utils/encrypt'
import { getUserId } from '@/utils/auth'

export function login(data) {
  const paramStr = genParam(data)

  return request({
    // url: '/vue-admin-template/user/login',
    url: '/admin/user/login',
    method: 'post',
    data: paramStr
  })
}

export function googleAuthenticator(code) {
  const param = { code: code }
  const paramStr = genParam(param)

  return request({
    // url: '/vue-admin-template/user/login',
    url: '/admin/user/authenticator',
    method: 'post',
    data: paramStr
  })
}

export function getInfo(token) {
  const id = getUserId()
  const data = { id: id, sign: signature({ id: id }) }
  return request({
    url: '/admin/user/' + id + '/info',
    method: 'get',
    headers: { 'Authorization': token }
  })
}

export function genGoogleCode(id) {
  const param = {
    action: 'genGoogleAuth'
  }
  const paramStr = genParam(param)

  return request({
    url: '/admin/user/' + id + '/googleAuth',
    method: 'put',
    data: paramStr
  })
}

export function logout() {
  return request({
    // url: '/vue-admin-template/user/logout',
    url: '/admin/user/logout',
    method: 'post'
  })
}

export function getList(params) {
  const paramStr = genParam(params)

  return request({
    url: '/admin/user/list',
    method: 'get',
    params
  })
}

export function createUser(params) {
  const param = {
    username: params.username,
    mobile: params.mobile,
    role: params.role,
    stats: params.stats,
    password: params.password
  }
  const paramStr = genParam(param)

  return request({
    url: '/admin/user/create',
    method: 'post',
    data: paramStr
  })
}

export function editUser(params) {
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
    url: '/admin/user/' + params.id + '/edit',
    method: 'put',
    data: paramStr
  })
}

export function deleteUser(params) {
  return request({
    url: '/admin/user/' + params.id + '/delete',
    method: 'delete'
  })
}
