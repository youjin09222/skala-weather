<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/weather/BaseDashboardCard.vue'
import WeatherCard from '../components/weather/WeatherCard.vue'
import { fetchWeatherForCoordsList } from '../services/weatherApi.js'
import { cityPool } from '../utils/cityNameMap.js'

const router = useRouter()

const weatherList = ref([])
const isLoading = ref(true)
const hasError = ref(false)
const selectedCityInfo = ref('✨ 카드를 뒤집거나, 오늘의 발길이 머무를 곳의 날씨를 찾아보세요.')

// Fisher-Yates 셔플 - 배열을 무작위로 섞는 표준 알고리즘
function shuffleArray(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// 후보 풀에서 무작위로 count개 뽑기 (기본 3개) - "오늘의 여행지 추천" 카드로 사용
function pickRandomCities(pool, count = 3) {
  return shuffleArray(pool).slice(0, count)
}

const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}

// 매 방문마다 후보 도시 중 3곳을 무작위로 뽑아 "오늘의 여행지"로 제시
onMounted(async () => {
  try {
    isLoading.value = true
    hasError.value = false

    const todaysCities = pickRandomCities(cityPool)
    const results = await fetchWeatherForCoordsList(todaysCities)

    weatherList.value = results.map((data, index) => ({
      id: todaysCities[index].nameKr,
      name: todaysCities[index].nameKr,
      temp: Math.round(data.main.temp),
      status: data.weather[0].description,
    }))
  } catch (error) {
    console.error('🔴 날씨 데이터 조회 실패:', error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="mockup-wrapper">
    <BaseDashboardCard>
      <h3 class="section-title">✦ 오늘의 여행지 추천 ✦</h3>

      <!-- 로딩 상태 처리 -->
      <div v-if="isLoading" class="skeleton-wrapper">
        <el-skeleton :rows="3" animated style="max-width: 500px; margin: 0 auto" />
        <p class="status-message">🔮 하늘의 기운을 읽는 중입니다...</p>
      </div>

      <!-- 에러 상태 처리 -->
      <p v-else-if="hasError" class="status-message error">
        ⚠️ 마법의 덱이 잠시 흔들렸습니다. 다시 시도해 주세요.
      </p>

      <!-- 정상 데이터 표시 -->
      <div v-else class="card-deck">
        <WeatherCard
          v-for="item in weatherList"
          :key="item.id"
          :city-item="item"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="goToDetail(item.id)"
        />
      </div>
    </BaseDashboardCard>

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
.mockup-wrapper {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  padding: 30px 0;
}
.section-title {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  letter-spacing: 2px;
  font-size: 15px;
  margin-bottom: 20px;
  color: #d4af37;
}
.card-deck {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: nowrap;
}
.status-message {
  font-family: 'Nanum Myeongjo', serif;
  color: #e8d5a8;
  padding: 30px 0;
  font-size: 15px;
}
.status-message.error {
  color: #e74c3c;
}
.status-bar {
  background: linear-gradient(160deg, #1a1a2e, #16213e);
  color: #d4af37;
  padding: 12px;
  border-radius: 10px;
  font-family: 'Nanum Myeongjo', serif;
  font-style: italic;
  font-size: 15px;
  letter-spacing: 0.5px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}
.skeleton-wrapper :deep(.el-skeleton__item) {
  background: rgba(212, 175, 55, 0.15);
}
</style>
