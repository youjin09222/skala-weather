<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

// 상세 페이지용 임시(mock) 데이터
const cityDetailMockData = {
  city_01: {
    name: '대한민국 서울특별시',
    temp: 28,
    status: '맑음',
    humidity: '55%',
    wind: '2.5m/s',
    advice: '태양 카드가 나왔습니다. 활기찬 에너지가 가득한 최고의 하루가 시작됩니다.',
  },
  city_02: {
    name: '경기도 수원시 영통구',
    temp: 24,
    status: '비',
    humidity: '85%',
    wind: '4.1m/s',
    advice: '비 카드가 나왔습니다. 차분한 실내에서 사색을 즐기기에 안성맞춤인 날입니다.',
  },
  city_03: {
    name: '부산광역시 해운대구',
    temp: 26,
    status: '구름',
    humidity: '65%',
    wind: '5.0m/s',
    advice: '구름 카드가 나왔습니다. 변화무쌍한 흐름 속에 작은 여유를 가져보세요.',
  },
}

const selectedCityDetail = ref(null)

// 컴포넌트가 화면에 붙는 시점에 라우터 파라미터 확인해서 데이터 조회
onMounted(() => {
  const cityId = route.params.cityId
  if (cityDetailMockData[cityId]) {
    selectedCityDetail.value = cityDetailMockData[cityId]
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

      <div v-if="selectedCityDetail" class="tarot-card-frame">
        <span class="card-badge">CLIMA ORACLE</span>
        <h4>{{ selectedCityDetail.name }}</h4>
        <p class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <div class="divider"></div>
        <p><strong>카드 속성:</strong> {{ selectedCityDetail.status }}</p>
        <p>대기 습도: {{ selectedCityDetail.humidity }}</p>
        <p>현재 풍속: {{ selectedCityDetail.wind }}</p>
        <div class="advice-box">
          <p>🔮 "{{ selectedCityDetail.advice }}"</p>
        </div>
      </div>

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

.advice-box p {
  font-style: italic;
  font-size: 13px;
  color: #3a2e22;
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
</style>
