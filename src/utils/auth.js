import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function delTagView() {
  return Cookies.remove('tagView')
}

export function setRemember(username) {
  Cookies.set('RememberUser', username)
}

export function getRemember(username) {
  return Cookies.get('RememberUser')
}

export function removeRemember() {
  return Cookies.remove('RememberUser')
}
