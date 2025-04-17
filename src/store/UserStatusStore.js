import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStatusStore = defineStore('userStatus', () => {
  // 是否登录
  const isLogin = ref(false)

  // 是否是管理员
  const isAdmin = ref(false)

  // 角色
  const roles = ref('admin')

  // 权限
  const userPermissions = ref([])

  // 获取登录状态
  const getLoginStatus = computed(() => {
    return localStorage.getItem('userKey')?.length > 0 || isLogin.value
  })

  const getUserIsAdmin = computed(() => {
    return localStorage.getItem('userKey') === 'admin'
  })

  // 设置状态（传入权限信息赋值给该状态）
  const setUserPermissions = params => {
    userPermissions.value = params
  }

  const getUserRole = computed(() => {
    return localStorage.getItem('userKey')
  })

  const setUserRole = role => {
    roles.value = role
  }

  //设置登录后的状态
  const afterLogin = userStoreData => {
    isLogin.value = true
    isAdmin.value = Boolean(userStoreData.isAdmin)
    localStorage.setItem('userKey', userStoreData.username)
    localStorage.setItem('userId', userStoreData._id)
  }

  //设置登出后的状态
  const userLogout = () => {
    isLogin.value = false
  }

  return {
    isLogin,
    isAdmin,
    roles,
    userPermissions,
    getLoginStatus,
    getUserIsAdmin,
    setUserPermissions,
    setUserRole,
    getUserRole,
    afterLogin,
    userLogout
  }
})

/* export const useUserStatusStore = defineStore('userStatus', {
  state: () => ({ isLogin: false }),
  getters: {
    getLoginStatus: (state) => {
      state.isLogin
    }
  },
  actions: {
    afterLogin(username) {
      this.isLogin = true
      localStorage.setItem('userKey', username)
    },
    userLogout() {
      this.isLogin = false
      localStorage.removeItem('userKey')
    }
  }
}) */
