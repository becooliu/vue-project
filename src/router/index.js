import { createRouter, createWebHistory } from "vue-router";
import { useUserStatusStore } from '@/store'
import { storeToRefs } from 'pinia'
import { layoutChildrens } from './layoutChildens'
const layoutChildrens = [
  {
    path: '/admin/userlist',
    name: 'user_list',
    component: () => import('@/components/admin/views/UserList.vue'),
    meta: {
      requireAuth: true, // 需要用户登录
      roles: ['admin'] //受访问限制的角色
    }
  },
  {
    path: '/roles/create',
    name: 'roles_create',
    component: () => import('@/components/roles/create.vue'),
    meta: {
      requireAuth: true, // 需要用户登录
      roles: ['admin'] //受访问限制的角色
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/user/index',
      name: 'user_index',
      component: () => import('@/components/user/index.vue'),
      meta: {
        title: '用户首页',
        requireAuth: true // 需要用户登录
      }
    },
    {
      path: '/user/regist',
      name: 'user_regist',
      component: () => import('@/components/user/views/RegistView.vue'),
      meta: {
        title: '用户注册'
      }
    },
    {
      path: '/user/login',
      name: 'user_login',
      component: () => import('@/components/user/views/LoginView.vue'),
      meta: {
        title: '用户登录'
      }
    },
    {
      path: '/denied',
      name: 'denied',
      component: () => import('@/components/denied/index.vue'), // 无权访问
      meta: {
        title: '无权限访问'
      }
    },
    {
      path: '/',
      name: 'layout',
      component: () => import('@/layout/index.vue'),
      meta: {
        title: '管理首页',
        requireAuth: true,
        roles: ['admin']
      },
      children: layoutChildrens
    }
  ]
})

// 添加路由前置守卫
router.beforeEach((to, from, next) => {
  const store = useUserStatusStore()

  //获取当前登录状态及用户角色
  const { getLoginStatus, getUserRole } = storeToRefs(store)

  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    // 如果需要，则检验用户是否登录
    if (getLoginStatus?.value) {
      console.log('router before each', getUserRole?.value)
      // 判断当前用户是否有访问该路由的权限
      // console.log(roles.value)
      if (to?.meta.roles) {
        if (to.meta.roles.includes(getUserRole?.value)) {
          next()
        } else {
          next('/denied')
        }
      } else {
        next()
      }
    } else {
      console.log('未登录')
      // 如果用未登录，则跳转登录页
      next('/user/login')
    }
  } else {
    next() // 如果不需要登录权限，则直接进入页面
  }
})

export default router;
