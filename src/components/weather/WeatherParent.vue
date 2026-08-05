<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

// 모든 반응형 데이터 소유 -> 자식들은 props/emit으로만 소통
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

watch(selectedCityInfo, (newInfo) => {
  console.log('👁️ [watch 감지] 상태바 문구 변경 ->', newInfo)
})

watchEffect(() => {
  console.log('🤖 [watchEffect 자동 호출] 현재 검색어 ->', searchQuery.value)
})

const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="mockup-wrapper">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <div class="card-deck">
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="showDetail"
        />
        <p v-if="filteredWeatherList.length === 0" class="no-result">
          😭 검색 결과와 일치하는 도시가 없습니다.
        </p>
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
.card-deck {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: nowrap;
}
.no-result {
  width: 100%;
  color: #e74c3c;
  font-family: 'Nanum Myeongjo', serif;
  padding: 20px 0;
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
