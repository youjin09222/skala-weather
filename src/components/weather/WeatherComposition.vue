<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

// 반응형 상태 3종
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// computed: 검색어가 도시 이름에 포함된 항목만 걸러서 새 배열 반환
// weatherList나 searchQuery가 바뀔 때마다 자동으로 다시 계산
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

// selectedCityInfo : "값이 실제로 바뀔 때"만 반응 -> 콘솔로그 기록
watch(selectedCityInfo, (newInfo) => {
  console.log('👁️ [watch 감지] 상태바 문구 변경 ->', newInfo)
})

// watchEffect: searchQuery가 바뀔 때마다 즉시 재실행
watchEffect(() => {
  console.log('🤖 [watchEffect 자동 호출] 현재 검색어 ->', searchQuery.value)
})

// 카드 클릭 시 상태바 메시지 갱신
const flippedCards = ref({})
const flipCard = (cityId) => {
  flippedCards.value[cityId] = !flippedCards.value[cityId]
}
const cardIcon = (status) => {
  const iconMap = { 맑음: '☀️', 비: '🌧️', 구름: '☁️' }
  return iconMap[status] || '🌫️'
}
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="mockup-wrapper">
    <section class="search-box">
      <h3>✦ 운명의 도시를 입력하소서 ✦</h3>
      <input
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="card-deck">
      <!-- filteredWeatherList로 렌더링 대상이 바뀜 -->
      <div
        v-for="item in filteredWeatherList"
        :key="item.id"
        class="card-scene"
        @click="
          () => {
            flipCard(item.id)
            selectedCityInfo = `${item.name}이 선택되었습니다.`
          }
        "
      >
        <div class="card" :class="{ 'is-flipped': flippedCards[item.id] }">
          <div class="card-face card-back">
            <span class="back-symbol">✦</span>
          </div>
          <div class="card-face card-front">
            <div class="card-icon">{{ cardIcon(item.status) }}</div>
            <h4>{{ item.name }}</h4>
            <p class="temp">{{ item.temp }}°C</p>
            <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
            <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
            <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
              상세보기
            </button>
          </div>
        </div>
      </div>

      <!-- 검색 결과 3단계 중 "불일치" 케이스 -->
      <p v-if="filteredWeatherList.length === 0" class="no-result">
        😭 검색 결과와 일치하는 도시가 없습니다.
      </p>
    </section>

    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
/* 스타일 그대로 재사용 */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital@0;1&family=Nanum+Myeongjo:wght@400;700&display=swap');

.mockup-wrapper {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  padding: 30px 0;
}
.search-box {
  background: linear-gradient(160deg, #1a1a2e, #16213e);
  color: #e8d5a8;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 0 24px rgba(120, 90, 200, 0.15);
  font-family: 'Nanum Myeongjo', serif;
}
.search-box h3 {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  letter-spacing: 2px;
  font-size: 15px;
  margin-bottom: 12px;
  color: #d4af37;
}
.search-box input {
  padding: 8px 14px;
  border-radius: 20px;
  border: 1px solid rgba(212, 175, 55, 0.5);
  background: rgba(255, 255, 255, 0.06);
  color: #f4e8d1;
  font-family: 'Nanum Myeongjo', serif;
  outline: none;
  text-align: center;
}
.search-box input::placeholder {
  color: rgba(232, 213, 168, 0.75);
}
.card-deck {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: nowrap;
  margin-bottom: 24px;
}
.no-result {
  width: 100%;
  color: #e74c3c;
  font-family: 'Nanum Myeongjo', serif;
  padding: 20px 0;
}
.card-scene {
  width: 170px;
  height: 240px;
  flex-shrink: 0;
  perspective: 1200px;
  cursor: pointer;
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card.is-flipped {
  transform: rotateY(180deg) scale(1.06);
}
.card-scene:has(.is-flipped) {
  animation: flip-glow 0.5s ease;
}
@keyframes flip-glow {
  0% {
    filter: drop-shadow(0 0 0 rgba(212, 175, 55, 0));
  }
  50% {
    filter: drop-shadow(0 0 22px rgba(212, 175, 55, 0.85));
  }
  100% {
    filter: drop-shadow(0 0 0 rgba(212, 175, 55, 0));
  }
}
.card-scene:hover .card:not(.is-flipped) {
  transform: translateY(-6px);
}
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-sizing: border-box;
}
.card-back {
  background: radial-gradient(circle at 50% 40%, #2c2a4a 0%, #12101f 80%);
  border: 1px solid rgba(212, 175, 55, 0.5);
  box-shadow:
    inset 0 0 30px rgba(120, 90, 200, 0.25),
    0 0 20px rgba(0, 0, 0, 0.5);
}
.back-symbol {
  font-size: 40px;
  color: #d4af37;
  text-shadow: 0 0 14px rgba(212, 175, 55, 0.7);
}
.card-front {
  background: radial-gradient(circle at 30% 20%, #fdf6e3 0%, #ecd9a8 100%);
  border: 1px solid #b8934a;
  transform: rotateY(180deg);
  text-align: center;
  box-shadow:
    inset 0 0 20px rgba(184, 147, 74, 0.25),
    0 0 24px rgba(212, 175, 55, 0.35);
  color: #2c2418;
}
.card-icon {
  font-size: 30px;
  margin-bottom: 4px;
}
.card-front h4 {
  font-family: 'Nanum Myeongjo', serif;
  font-weight: 400;
  font-size: 20px;
  letter-spacing: 1px;
  margin: 4px 0;
  color: #4a3520;
}
.temp {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-style: italic;
  font-weight: 500;
  margin: 6px 0;
  color: #6b4d2e;
}
.badge {
  display: inline-block;
  padding: 3px 12px;
  font-size: 11px;
  font-family: 'Nanum Myeongjo', serif;
  font-weight: 400;
  border-radius: 20px;
  margin: 6px 0;
  color: #fdf6e3;
  letter-spacing: 0.5px;
}
.hot {
  background: linear-gradient(90deg, #7a2f2f, #b0473f);
  box-shadow: 0 0 10px rgba(176, 71, 63, 0.5);
}
.cool {
  background: linear-gradient(90deg, #2f4d7a, #3f74b0);
  box-shadow: 0 0 10px rgba(63, 116, 176, 0.5);
}
.btn-detail {
  margin-top: 10px;
  padding: 5px 16px;
  font-size: 12px;
  font-family: 'Nanum Myeongjo', serif;
  cursor: pointer;
  border: 1px solid #b8934a;
  background: transparent;
  color: #6b4d2e;
  border-radius: 20px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}
.btn-detail:hover {
  background: #b8934a;
  color: #fdf6e3;
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
