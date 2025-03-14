import { deleteCookie } from './tools'

// 用户登出后，删除localStorage 和 cookie
export const setLogoutData = () => {
  localStorage.removeItem('userKey')
  localStorage.removeItem('userId')
  deleteCookie('userInfo')
}
