import request from '@/utils/request'

export function getMenuTree() {
  return request({
    url: '/menu/getMenuTree',
    method: 'post'
  })
}

export function save(menu) {
  return request({
    url: '/menu/save',
    method: 'post',
    data: menu
  })
}

export function deleteMenu(menuId) {
  return request({
    url: '/menu/deleteMenu',
    method: 'post',
    params: { menuId }
  })
}
