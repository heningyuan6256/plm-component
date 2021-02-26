
import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/vue-element-admin/getList/dict',
    method: 'get',
    params
  })
}

export function userSearch(params) {
  return request({
    url: '/vue-element-admin/county/list',
    method: 'get',
    params
  })
}

export function getTreeList(params) {
  return request({
    url: '/vue-element-admin/sascaderList/list',
    method: 'get',
    params
  })
}
