<script setup>
import { ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/weather/BaseDashboardCard.vue'
import SearchBar from '../components/weather/SearchBar.vue'
import WeatherCard from '../components/weather/WeatherCard.vue'
import { fetchWeatherByCity } from '../services/weatherApi.js'
import { resolveCityQuery } from '../utils/cityNameMap.js'

const router = useRouter()

const searchQuery = ref('')
const selectedCityInfo = ref('✨ 카드를 뒤집거나, 오늘의 발길이 머무를 곳의 날씨를 찾아보세요.')

const searchResult = ref(null)
const isSearching = ref(false)
const searchError = ref(false)

const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}

// 전국 조회: 검색어 기준으로 실API 직접 조회 (한글은 최소 2글자부터)
const handleSearch = async () => {
  const keyword = searchQuery.value.trim()
  if (!keyword) {
    searchResult.value = null
    return
  }

  try {
    isSearching.value = true
    searchError.value = false
    const query = resolveCityQuery(keyword)
    const data = await fetchWeatherByCity(query)
    searchResult.value = {
      id: data.resolvedNameKo,
      name: `${data.resolvedNameKo}, ${data.resolvedCountry}`,
      temp: Math.round(data.main.temp),
      status: data.weather[0].description,
    }
  } catch (error) {
    console.error('🔴 검색 도시 조회 실패:', error)
    searchResult.value = null
    searchError.value = true
  } finally {
    isSearching.value = false
  }
}

// 타이핑이 멈추고 500ms 후 자동 검색 (최소 2글자 이상)
watchEffect((onCleanup) => {
  const keyword = searchQuery.value.trim()
  if (!keyword || keyword.length < 2) {
    searchResult.value = null
    searchError.value = false
    return
  }
  const timer = setTimeout(() => {
    handleSearch()
  }, 500)
  onCleanup(() => clearTimeout(timer))
})

// 검색어를 지우면 검색 결과도 초기화
const handleQueryUpdate = (val) => {
  searchQuery.value = val
  if (!val.trim()) {
    searchResult.value = null
    searchError.value = false
  }
}
</script>

<template>
  <div class="mockup-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="handleQueryUpdate" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <!-- 검색 중 -->
      <p v-if="isSearching" class="status-message">🔮 해당 지역의 기운을 읽는 중입니다...</p>

      <!-- 검색 실패 -->
      <p v-else-if="searchError" class="status-message error">
        ⚠️ 운명의 지도에서 해당 지역을 찾을 수 없습니다.
      </p>

      <!-- 정상 데이터 표시 -->
      <div v-else-if="searchResult" class="card-deck">
        <WeatherCard
          :city-item="searchResult"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="goToDetail(searchResult.id)"
        />
      </div>

      <!-- 초기 안내 -->
      <p v-else class="status-message">🗺️ 도시 이름을 입력하고 전국의 날씨를 확인해 보세요.</p>
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
</style>
