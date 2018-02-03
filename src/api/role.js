import request from '@/utils/request'

export function getRoleList(listQuery) {
  return request({
    url: '/role/findList',
    method: 'post',
    data: listQuery
  })
}
export function saveRoleMenu(roleMenu) {
  return request({
    url: '/role/saveRoleMenu',
    method: 'post',
    data: roleMenu
  })
}

export function saveRole(role) {
  return request({
    url: '/role/save',
    method: 'post',
    data: role
  })
}

export function getAllRole() {
  return request({
    url: '/role/getAllRole',
    method: 'post'
  })
}
