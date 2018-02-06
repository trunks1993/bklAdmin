import request from '@/utils/request'

export function getArticleList(listQuery) {
  return request({
    url: '/advArticle/findList',
    method: 'post',
    data: listQuery
  })
}

export function saveArticle(article) {
  return request({
    url: '/advArticle/save',
    method: 'post',
    data: article
  })
}

export function deleteArticle(advId) {
  return request({
    url: '/advArticle/delete',
    method: 'post',
    params: {
      advId
    }
  })
}
