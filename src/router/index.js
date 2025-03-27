import LandingPageView from '@/pages/LandingPage/LandingPageView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ConsultSubjectsView from '../pages/ConsultSubjetcs/ConsultSubjectsView.vue'
import DashboardView from '../pages/Dashboard/DashboardView.vue'
import FriendsView from '../pages/Friends/FriendsView.vue'
import HomeView from '../pages/Home/HomeView.vue'
import ProfileView from '@/pages/Profile/ProfileView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
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
      path: '/profile/:id',
      name: 'profile',
      component: ProfileView
    }
  ]
})

export default router
