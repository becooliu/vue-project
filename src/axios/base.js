import axios from 'axios'

// axios.defaults.baseURL = 'http://localhost:8088'
axios.defaults.withCredentials = true // 默认携带cookie

const instance = axios.create({
  baseURL: 'http://localhost:8088', // 服务器地址
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

export default instance
