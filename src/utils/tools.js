export const isEmail = email => {
  var p = /\s*\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*\s*/
  return p.test(email)
}

export const setCookie = (cookieName, cookieValue, expireDays) => {
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expireDays)
  document.cookie =
    cookieName + '=' + escape(cookieValue) + (expireDays == null ? 1 : ';path=/; expires=' + exdate.toGMTString())
}

export const getCookie = name => {
  var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'))
  if (arr != null) {
    return unescape(arr[2])
  }
  return null
}

export const deleteCookie = name => {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null) document.cookie = name + '=' + cval + ';path=/;expires=' + exp.toGMTString()
}

export const dateToLocaleString = str => {
  return new Date(str).toLocaleString()
}

export const timeStringToDate = timestamp => {
  timestamp = Number(timestamp)
  let date = new Date(timestamp)
  let curYear = new Date().getFullYear()
  let Y = date.getFullYear() == curYear ? '' : curYear + '-'
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  console.log('M', M)
  let D = date.getDate() + ''
  return Y + M + D
}
