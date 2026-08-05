<script setup>
import { ref, watchEffect } from 'vue'
import { fetchWeatherByCity } from '../services/weatherApi.js'
import WeatherCard from '../components/weather/WeatherCard.vue'

const searchInput = ref('')
const searchResult = ref(null)
const isSearching = ref(false)
const searchError = ref(false)
const statusMessage = ref('세계 어느 도시든 영문명으로 입력해 보세요 (예: Tokyo, Paris, New York).')

const handleSearch = async (keyword) => {
  if (!keyword) {
    searchResult.value = null
    searchError.value = false
    return
  }
  try {
    isSearching.value = true
    searchError.value = false
    const data = await fetchWeatherByCity(keyword)

    // 지오코딩이 실제로 인식한 지명 표시
    searchResult.value = {
      id: `world_${Date.now()}`,
      name: `${data.resolvedNameEn}, ${data.resolvedCountry}`,
      temp: Math.round(data.main.temp),
      status: data.weather[0].description,
    }
  } catch (error) {
    console.error('🔴 세계 도시 조회 실패:', error)
    searchResult.value = null
    searchError.value = true
  } finally {
    isSearching.value = false
  }
}

// 최소 3글자 이상 입력했을 때, 타이핑 멈추고 600ms 후 자동 검색
watchEffect((onCleanup) => {
  const keyword = searchInput.value.trim()
  if (!keyword || keyword.length < 3) {
    searchResult.value = null
    searchError.value = false
    return
  }
  const timer = setTimeout(() => {
    handleSearch(keyword)
  }, 600)
  onCleanup(() => clearTimeout(timer))
})
</script>

<template>
  <div class="world-wrapper">
    <div class="search-card">
      <h3>✦ 세계 어디든, 오늘의 카드를 확인하세요 ✦</h3>
      <div class="search-box">
        <input
          v-model="searchInput"
          type="text"
          placeholder="영문 도시명 입력 (예: Tokyo, Paris)"
          autocomplete="off"
        />
      </div>

      <p v-if="isSearching" class="status-message">🔮 지구 반대편의 기운을 읽는 중입니다...</p>
      <p v-else-if="searchError" class="status-message error">
        ⚠️ 해당 지역의 카드를 찾을 수 없습니다. 영문 도시명으로 다시 시도해 보세요.
      </p>
      <div v-else-if="searchResult" class="card-deck">
        <WeatherCard
          :city-item="searchResult"
          @select-card="(msg) => (statusMessage = msg)"
          @click-detail="() => {}"
        />
      </div>
    </div>
    <div class="status-bar">{{ statusMessage }}</div>
  </div>
</template>

<style scoped>
.world-wrapper {
  max-width: 700px;
  margin: 40px auto;
  text-align: center;
  padding: 0 20px;
}
.search-card {
  background: linear-gradient(160deg, #1a1a2e, #16213e);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 0 24px rgba(120, 90, 200, 0.15);
}
.search-card h3 {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  letter-spacing: 1px;
  font-size: 15px;
  color: #d4af37;
  margin-bottom: 16px;
}
.search-box {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}
.search-box input {
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.5);
  background: rgba(255, 255, 255, 0.06);
  color: #f4e8d1;
  font-family: 'Nanum Myeongjo', serif;
  outline: none;
  width: 260px;
  text-align: center;
}
.card-deck {
  display: flex;
  justify-content: center;
}
.status-message {
  font-family: 'Nanum Myeongjo', serif;
  color: #e8d5a8;
  padding: 16px 0 0;
  font-size: 14px;
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
  font-size: 14px;
  border: 1px solid rgba(212, 175, 55, 0.3);
}
</style>
