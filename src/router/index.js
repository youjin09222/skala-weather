import { createRouter, createWebHistory } from 'vue-router'

// 메인 화면만 즉시 로딩, 나머지는 지연 로딩 적용
const routes = [
  {
    path: '/',
    name: 'WeatherHome',
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
    // 정의된 경로 어디에도 해당하지 않는 주소를 모두 잡아냄
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
