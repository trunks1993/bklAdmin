import request from '@/utils/request'

export function getAdvertList(listQuery) {
  return request({
    url: '/advert/findList',
    method: 'post',
    data: listQuery
  })
}

export function saveAdvert(Advert) {
  return request({
    url: '/advert/save',
    method: 'post',
    data: Advert
  })
}

export function deleteAdvert(advId) {
  return request({
    url: '/advert/delete',
    method: 'post',
    params: {
      advId
    }
  })
}
