import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    children: [
      {
        path: '/',
        name: 'Posts',
        component: () => import('../views/Posts.vue')
      },
      {
        path: 'images',
        name: 'Images',
        component: () => import('../views/Images.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/post',
    name: 'PostPage',
    component: () => import('../views/PostPage.vue')
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: () => import('../views/SignIn.vue')
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: () => import('../views/SignUp.vue')
  },
  {
    path: '/user-center',
    name: 'UserCenter',
    component: () => import('../views/UserCenter.vue'),
    children: [
      {
        path: 'personal-info',
        name: 'UserPersonalInformation',
        component: () => import('../views/user/PersonalInformation.vue')
      },
      {
        path: 'messages',
        name: 'UserMessages',
        component: () => import('../views/user/Messages.vue')
      },
      {
        path: 'posts',
        name: 'UserPosts',
        component: () => import('../views/user/Posts.vue')
      },
      {
        path: 'replies',
        name: 'UserReplies',
        component: () => import('../views/user/Replies.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
