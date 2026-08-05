<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { fetchWeatherByCity } from '../services/weatherApi.js'
import { resolveCityQuery } from '../utils/cityNameMap.js'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const selectedCityDetail = ref(null)
const isLoading = ref(true)
const hasError = ref(false)

// 날씨 상태를 이모지로 변환 (WeatherCard.vue와 동일한 매핑 로직)
function weatherIcon(status) {
  if (status.includes('맑')) return '☀️'
  if (status.includes('비')) return '🌧️'
  if (status.includes('눈')) return '❄️'
  if (status.includes('구름')) return '☁️'
  return '🌫️'
}

// 날씨 상태 문구에 맞춰 타로풍 운세 문구를 동적으로 생성
function generateAdvice(status) {
  if (status.includes('맑')) {
    return {
      title: '태양 카드가 나왔습니다.',
      body: '활기찬 에너지가 가득한 최고의 하루가 시작됩니다.',
    }
  }
  if (status.includes('비')) {
    return {
      title: '비 카드가 나왔습니다.',
      body: '차분한 실내에서 사색을 즐기기에 안성맞춤인 날입니다.',
    }
  }
  if (status.includes('눈')) {
    return { title: '눈 카드가 나왔습니다.', body: '고요한 순백의 기운이 마음을 정화시켜 줍니다.' }
  }
  if (status.includes('구름')) {
    return {
      title: '구름 카드가 나왔습니다.',
      body: '변화무쌍한 흐름 속에 작은 여유를 가져보세요.',
    }
  }
  return {
    title: '안개 카드가 나왔습니다.',
    body: '불확실함 속에서도 한 걸음씩 나아가는 지혜가 필요한 날입니다.',
  }
}

// 컴포넌트가 화면에 붙는 시점에 라우터 파라미터(도시명)로 실제 API 조회
onMounted(async () => {
  const cityId = route.params.cityId
  try {
    isLoading.value = true
    hasError.value = false

    const query = resolveCityQuery(cityId)
    const data = await fetchWeatherByCity(query)

    selectedCityDetail.value = {
      name: `${data.resolvedNameKo}, ${data.resolvedCountry}`,
      temp: Math.round(data.main.temp),
      status: data.weather[0].description,
      humidity: `${data.main.humidity}%`,
      wind: `${data.wind.speed}m/s`,
      advice: generateAdvice(data.weather[0].description),
    }
  } catch (error) {
    console.error('🔴 상세 정보 조회 실패:', error)
    selectedCityDetail.value = null
    hasError.value = true
  } finally {
    isLoading.value = false
  }
})

// 메인 화면과 동일한 방식으로 단위 변환 적용
const displayTemp = computed(() => {
  if (!selectedCityDetail.value) return 0
  const rawTemp = selectedCityDetail.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div class="detail-wrapper">
    <div class="detail-card">
      <h3>✦ 오픈된 운명의 카드 ✦</h3>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="error-body">
        <p class="error-message">🔮 카드를 확인하는 중입니다...</p>
      </div>

      <!-- 정상 데이터 -->
      <div v-else-if="selectedCityDetail" class="tarot-card-frame">
        <span class="card-badge">CLIMA ORACLE</span>
        <div class="weather-icon">{{ weatherIcon(selectedCityDetail.status) }}</div>
        <h4>{{ selectedCityDetail.name }}</h4>
        <p class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <div class="divider"></div>
        <p>대기 습도: {{ selectedCityDetail.humidity }}</p>
        <p>현재 풍속: {{ selectedCityDetail.wind }}</p>
        <div class="advice-box">
          <p class="advice-title">🔮 {{ selectedCityDetail.advice.title }}</p>
          <p class="advice-body">"{{ selectedCityDetail.advice.body }}"</p>
        </div>
      </div>

      <!-- 에러/실패 상태 -->
      <div v-else class="error-body">
        <p class="error-message">해당 카드는 존재하지 않습니다. 패를 다시 확인해 주세요.</p>
      </div>

      <button class="btn-detail" @click="router.push('/')">← 메인 덱으로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.detail-wrapper {
  max-width: 500px;
  margin: 40px auto;
  padding: 0 20px;
}

.detail-card {
  background: linear-gradient(160deg, #1a1a2e, #16213e);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 14px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 0 24px rgba(120, 90, 200, 0.15);
  color: #e8d5a8;
}

.detail-card h3 {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  letter-spacing: 2px;
  color: #d4af37;
  margin-bottom: 20px;
}

.tarot-card-frame {
  background: radial-gradient(circle at 50% 30%, #fdf6e3 0%, #ecd9a8 100%);
  border: 2px solid #b8934a;
  border-radius: 10px;
  padding: 24px;
  color: #2c2418;
  box-shadow: inset 0 0 15px rgba(184, 147, 74, 0.3);
  position: relative;
}

.card-badge {
  display: inline-block;
  font-family: 'Cinzel', serif;
  font-size: 10px;
  letter-spacing: 1px;
  color: #8c6d3b;
  border: 1px solid #b8934a;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.tarot-card-frame h4 {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 20px;
  margin-bottom: 6px;
  color: #2c2418;
}

.temp {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 28px;
  font-weight: 700;
  margin: 6px 0;
  color: #5a3d1e;
}

.divider {
  width: 40px;
  height: 1px;
  background: #b8934a;
  margin: 12px auto;
}

.tarot-card-frame p {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 14px;
  margin: 4px 0;
  color: #4a3b2c;
}

.advice-box {
  margin-top: 16px;
  padding: 10px;
  background: rgba(184, 147, 74, 0.15);
  border-radius: 6px;
  border-left: 3px solid #b8934a;
}

.advice-title {
  font-style: normal;
  font-weight: 700;
  font-size: 13px;
  color: #3a2e22;
  margin: 0 0 6px 0;
}
.advice-body {
  font-style: italic;
  font-size: 13px;
  color: #3a2e22;
  word-break: keep-all;
  line-height: 1.6;
  margin: 0;
}

.error-body {
  padding: 30px 0;
}

.error-message {
  font-family: 'Nanum Myeongjo', serif;
  color: #e8d5a8;
  font-size: 14px;
}

.btn-detail {
  margin-top: 24px;
  padding: 8px 20px;
  font-size: 13px;
  font-family: 'Nanum Myeongjo', serif;
  cursor: pointer;
  border: 1px solid rgba(212, 175, 55, 0.6);
  background: transparent;
  color: #d4af37;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.btn-detail:hover {
  background: rgba(212, 175, 55, 0.15);
  color: #f4e8d1;
}

.weather-icon {
  font-size: 50px;
  margin: 8px 0 4px;
}
</style>
