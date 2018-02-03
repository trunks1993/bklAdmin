import request from '@/utils/request'

export function getErrorList(listQuery) {
  return request({
    url: '/sysError/findList',
    method: 'post',
    data: listQuery
  })
}

export function getScanLogList(listQuery) {
  return request({
    url: '/scanLog/findList',
    method: 'post',
    data: listQuery
  })
}