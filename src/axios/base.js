import axios from 'axios'
import { getCookie } from '@/utils'

// axios.defaults.baseURL = 'http://localhost:8088'

const instance = axios.create({
  baseURL: 'http://localhost:8088', // 服务器地址
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

document.cookie = getCookie('userinfo')

export default instance
