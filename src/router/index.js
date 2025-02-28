import { createRouter, createWebHistory } from "vue-router";
import { useUserStatusStore } from '@/store'
import { storeToRefs } from 'pinia'
import { layoutChildrens } from './layoutChildens'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/blog/details/:_id',
      name: 'blog_details',
      component: () => import('@/components/blog/BlogDetails.vue'),
      meta: {
        title: '博客详情'
      }
    },
    {
      path: '/user/index',
      name: 'user_index',
      component: () => import('@/components/user/index.vue'),
      meta: {
        title: '用户首页',
        requireAuth: true // 需要用户登录
      },
      children: [
        {
          path: '/blog/add',
          name: 'blog_add',
          component: () => import('@/components/blog/add.vue'),
          meta: {
            title: '写博客',
            requireAuth: true
          }
        },
        {
          path: '/blog/updateContent',
          name: 'blog_updateContent',
          component: () => import('@/components/blog/UpdateContent.vue'),
          meta: {
            title: '更新博客',
            requireAuth: true
          }
        },
        {
          path: '/blog/list',
          name: 'blog_list',
          component: () => import('@/components/blog/BlogList.vue'),
          meta: {
            title: '博客列表'
          }
        },
        {
          path: '/blog/list/my',
          name: 'blog_list_my',
          component: () => import('@/layout/components/blog/List.vue'),
          meta: {
            title: '管理我的发布'
          }
        }
      ]
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
  window.document.title = to.meta?.title
  // 判断该路由是否需要登录权限
  if (to.meta.requireAuth) {
    // 如果需要，则检验用户是否登录
    if (getLoginStatus?.value) {
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
