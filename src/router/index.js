import { createRouter, createWebHistory } from 'vue-router'

// 메인 화면만 즉시 로딩, 나머지는 실제 그 경로에 진입할 때만 불러오는 지연 로딩(lazy loading) 적용
const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/MainView.vue'),
  },
  {
    path: '/national',
    name: 'WeatherNational',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/world',
    name: 'WeatherWorld',
    component: () => import('../views/WorldWeatherView.vue'),
  },
  {
    path: '/about',
    name: 'WeatherAbout',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'WeatherDetail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
