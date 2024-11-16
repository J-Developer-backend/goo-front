import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: () => import("@/views/loginView.vue")
  },
  {
    path: '/register',
    component: () => import("@/views/registerView.vue")
  },
  {
    path: '/',
    component: () => import("@/views/homeView.vue"),
    redirect: '/home/welcome',
    children: [
      {
        path: '/home/addItem',
        name: 'AddItem',
        component: () => import('@/views/AddItem.vue'),
      },
      {
        path: '/home/items',
        component: () => import("@/views/itemsView.vue")
      },
      {
        path: '/home/order',
        component: () => import("@/views/orderView.vue")
      },
      {
        path: '/home/message',
        component: () => import("@/views/messageView.vue")
      },
      {
        path: '/home/details/:itemId',
        component: () => import("@/views/detailsView.vue")
      },
      {
        path: '/home/like',
        component: () => import("@/views/likeView.vue")
      },
      {
        path: '/home/welcome',
        component: () => import("@/views/welcomeView.vue")
      },
      {
        path: '/home/register',
        component: () => import("@/views/registerView.vue")
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
