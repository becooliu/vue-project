import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStatusStore = defineStore('userStatus', () => {
  const isLogin = ref(false)
  const getLoginStatus = computed(() => {
    return localStorage.getItem('userKey')?.length || isLogin
  })
  function afterLogin(username) {
    isLogin.value = true
    localStorage.setItem('userKey', username)
  }

  function userLogout() {
    isLogin.value = false
    localStorage.removeItem('userKey')
  }

  return { isLogin, getLoginStatus, afterLogin, userLogout }
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
