<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/weather/BaseDashboardCard.vue'
import SearchBar from '../components/weather/SearchBar.vue'
import WeatherCard from '../components/weather/WeatherCard.vue'
import { fetchWeatherForCities, fetchWeatherByCity } from '../services/weatherApi.js'
import { resolveCityQuery } from '../utils/cityNameMap.js'

const router = useRouter()

// 목데이터의 도시 이름(영문)을 API 조회용으로 매핑
const cityConfig = [
  { id: 'city_01', nameKr: '서울', nameEn: 'Seoul' },
  { id: 'city_02', nameKr: '수원', nameEn: 'Suwon' },
  { id: 'city_03', nameKr: '부산', nameEn: 'Busan' },
]

// 실제 API 데이터가 채워질 반응형 배열
const weatherList = ref([])
const isLoading = ref(true)
const hasError = ref(false)

const searchQuery = ref('')
const selectedCityInfo = ref('✨ 카드를 뒤집거나, 오늘의 발길이 머무를 곳의 날씨를 찾아보세요.')

// 전국 실시간 검색 결과 (검색 안 했을 땐 null -> 기본 3개 도시 표시)
const searchResult = ref(null)
const isSearching = ref(false)
const searchError = ref(false)

// 화면에 실제로 그릴 목록: 검색 결과가 있으면 그것만, 없으면 기본 필터링된 목록
const displayList = computed(() => {
  if (searchResult.value) return [searchResult.value]
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

watch(selectedCityInfo, (newInfo) => {
  console.log('👁️ [watch 감지] 상태바 문구 변경 ->', newInfo)
})

watchEffect((onCleanup) => {
  console.log('🤖 [watchEffect 자동 호출] 현재 검색어 ->', searchQuery.value)

  const keyword = searchQuery.value.trim()

  // 검색어가 비었으면 바로 초기화하고 API 호출 안 함
  if (!keyword) {
    searchResult.value = null
    searchError.value = false
    return
  }

  // 타이핑이 멈추고 400ms 후에 자동 검색 실행
  const timer = setTimeout(() => {
    handleSearch()
  }, 400)

  // searchQuery가 다시 바뀌거나 컴포넌트가 사라지면 이전 타이머 취소
  onCleanup(() => clearTimeout(timer))
})

const goToDetail = (cityId) => {
  router.push(`/weather/${cityId}`)
}

// 컴포넌트가 화면에 붙는 시점에 실제 API 호출
onMounted(async () => {
  try {
    isLoading.value = true
    hasError.value = false

    const results = await fetchWeatherForCities(cityConfig)

    // API 응답을 카드 컴포넌트가 기대하는 형태로 변환
    weatherList.value = results.map((data, index) => ({
      id: cityConfig[index].id,
      name: cityConfig[index].nameKr,
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

// 전국 조회: 기본 3개 도시 밖의 지역도 실API로 직접 조회
const handleSearch = async () => {
  const keyword = searchQuery.value.trim()
  if (!keyword) {
    searchResult.value = null
    return
  }
  // 먼저 기본 3개 도시 안에 있는지 확인 -> 있으면 굳이 API 재조회하지 않고 로컬에서 바로 보여줌
  const localMatch = weatherList.value.find((item) => item.name.includes(keyword))
  if (localMatch) {
    searchResult.value = null // displayList가 알아서 로컬 필터링 결과를 보여주게 둠
    return
  }

  try {
    isSearching.value = true
    searchError.value = false
    const query = resolveCityQuery(keyword)
    const data = await fetchWeatherByCity(query)
    searchResult.value = {
      id: `search_${Date.now()}`,
      name: keyword,
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

// 검색어를 지우면 검색 결과도 초기화하고 기본 대시보드로 복귀
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
      <!-- 로딩 상태 처리 -->
      <p v-if="isLoading" class="status-message">🔮 하늘의 기운을 읽는 중입니다...</p>

      <!-- 에러 상태 처리 -->
      <p v-else-if="hasError" class="status-message error">
        ⚠️ 마법의 덱이 잠시 흔들렸습니다. 다시 시도해 주세요.
      </p>

      <!-- 검색 중 -->
      <p v-else-if="isSearching" class="status-message">🔮 해당 지역의 기운을 읽는 중입니다...</p>

      <!-- 검색 실패 -->
      <p v-else-if="searchError" class="status-message error">
        ⚠️ 운명의 지도에서 해당 지역을 찾을 수 없습니다.
      </p>

      <!-- 정상 데이터 표시 -->
      <div v-else class="card-deck">
        <WeatherCard
          v-for="item in displayList"
          :key="item.id"
          :city-item="item"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="goToDetail(item.id)"
        />
        <p v-if="displayList.length === 0" class="no-result">
          😭 운명의 지도에서 해당 지역을 찾을 수 없습니다.
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
.search-action {
  margin-top: 12px;
}
.search-btn {
  padding: 6px 16px;
  font-size: 13px;
  font-family: 'Nanum Myeongjo', serif;
  cursor: pointer;
  border: 1px solid rgba(212, 175, 55, 0.6);
  background: transparent;
  color: #d4af37;
  border-radius: 20px;
  transition: all 0.3s ease;
}
.search-btn:hover {
  background: rgba(212, 175, 55, 0.15);
  color: #f4e8d1;
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
