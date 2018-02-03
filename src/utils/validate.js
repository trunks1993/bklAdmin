/**
 * Created by trunks on 17/12/09.
 */
import { isValidUsername } from '@/api/user'


/* 是否存在帐号 */
export function isvalidUsername(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  return true
}

/* 合法uri*/
export function validateURL(textval) {
  // const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  // return urlregex.test(textval)
  return textval.substr(0,7).toLowerCase() === "http://"||textval.substr(0,8).toLowerCase() === "https://"

}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}
/*合法手机号吗*/
export function isvalidPhone(str) {
  const reg = /^1[34578]\d{9}$/
  return reg.test(str)
}
const validateAdLink = (rule, value, callback) => {
  if (!value) {
    callback(new Error('链接不能为空'));
  }
  if (!validateURL(value)) {
    callback(new Error('链接格式必须以 http:// 或 https:// 开头'));
  }
  callback()

}
const validateUsername = (rule, value, callback) => {
  if (!value) {
    callback(new Error('帐号不能为空'));
  } else {
    isValidUsername(value).then(response => {
      const data = response.data
      if (data.code === 1) callback(new Error(data.msg))
      callback()
    })
  }
}
const validatePhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error('手机号码不能为空'))
  }
  if (!isvalidPhone(value)) {
    callback(new Error('请填写正确的11位手机号'))
  }
  callback()
}

export { validateUsername, validatePhone, validateAdLink }
