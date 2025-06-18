import FriendsInterestsView from '@/views/FriendsInterests/FriendsInterestsView.vue'
import LandingPageView from '@/views/LandingPage/LandingPageView.vue'
import NotFoundView from '@/views/NotFound/NotFoundView.vue'
import ProfileView from '@/views/Profile/ProfileView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ConsultSubjectsView from '../views/ConsultSubjetcs/ConsultSubjectsView.vue'
import DashboardView from '../views/Dashboard/DashboardView.vue'
import FriendsView from '../views/Friends/FriendsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: LandingPageView
    },
    {
      path: '/disciplinas',
      name: 'subjects',
      component: ConsultSubjectsView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/amigos',
      name: 'friends',
      component: FriendsView
    },
    {
      path: '/perfil/:id',
      name: 'profile',
      component: ProfileView
    },{
      path:"/interesses",
      name: 'interests',
      component:FriendsInterestsView
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: NotFoundView
    }
  ]
})

export default router
