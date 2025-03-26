import InterestedSubjectsView from '@/pages/InterestedSubjects/InterestedSubjectsView.vue'
import LandingPageView from '@/pages/LandingPage/LandingPageView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ConsultSubjectsView from '../pages/ConsultSubjetcs/ConsultSubjectsView.vue'
import DashboardView from '../pages/Dashboard/DashboardView.vue'
import FriendsView from '../pages/Friends/FriendsView.vue'


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
      path:'/interesses',
      name:'interests',
      component:InterestedSubjectsView
    }
  ]
})

export default router
