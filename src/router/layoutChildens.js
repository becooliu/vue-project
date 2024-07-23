// 管理面板的子路由
export const layoutChildrens = [
  {
    path: '/admin/userlist',
    name: 'user_list',
    component: () => import('@/components/admin/UserList.vue'),
    meta: {
      title: '用户列表',
      requireAuth: true, // 需要用户登录
      roles: ['admin'] //受访问限制的角色
    }
  },
  {
    path: '/roles/create',
    name: 'roles_create',
    component: () => import('@/components/roles/create.vue'),
    meta: {
      title: '创建用户角色',
      requireAuth: true, // 需要用户登录
      roles: ['admin'] //受访问限制的角色
    }
  },
  {
    path: '/getApiVisited',
    name: 'get_api_visited',
    component: () => import('@/layout/components/apivisited/index.vue'),
    meta: {
      title: '',
      requireAuth: true, // 需要用户登录
      roles: ['admin'] //受访问限制的角色
    }
  },
  {
    path: '/blog_category/add',
    name: 'blog_category_create',
    component: () => import('@/components/blog_category/add.vue'),
    meta: {
      title: '新增博客分类',
      requireAuth: true, // 需要用户登录
      roles: ['admin'] //受访问限制的角色
    }
  }
]
