import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/bookingFlight',
      name: 'bookingFlight',
      component: () => import('../views/BookingFlightView.vue')
    },
    {
      path: '/user/regist',
      name: 'user_regist',
      component: () => import('../views/user/RegistView.vue')
    }
  ]
})

export default router
