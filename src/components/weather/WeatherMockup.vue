<script setup>
import { ref } from 'vue'

// 날씨 데이터 배열 (v-for 렌더링용, :key는 id 사용)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])

// 검색어 (value/@input 직접 사용하여 한글 처리)
const searchQuery = ref('')

// 카드 클릭 시 상태바에 표시할 메시지
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 카드별로 뒤집힘(플립) 여부를 저장하는 객체
// 카드가 여러 장이라 각 카드가 독립적으로 뒤집혀야 하므로 id를 key로 관리
const flippedCards = ref({})
const flipCard = (cityId) => {
  flippedCards.value[cityId] = !flippedCards.value[cityId]
}

// 날씨 상태 → 타로 아이콘 매핑
const cardIcon = (status) => {
  const iconMap = { 맑음: '☀️', 비: '🌧️', 구름: '☁️' }
  return iconMap[status] || '🌫️'
}

// [상세보기] 버튼 클릭 시 실행되는 알림 함수
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="mockup-wrapper">
    <!-- 검색창: 한글 입력 즉시 반영, :value + @input 명시적 사용 -->
    <section class="search-box">
      <h3>✦ 그대의 발길이 닿을 곳을 알려주소서 ✦</h3>
      <input
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value)"
        placeholder="검색할 도시 이름 입력"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <!-- 카드 리스트: v-for + :key -->
    <section class="card-deck">
      <div
        v-for="item in weatherList"
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
          <!-- 카드 뒷면 (기본 상태) -->
          <div class="card-face card-back">
            <span class="back-symbol">✦</span>
          </div>

          <!-- 카드 앞면 (클릭하면 뒤집힘) -->
          <div class="card-face card-front">
            <div class="card-icon">{{ cardIcon(item.status) }}</div>
            <h4>{{ item.name }}</h4>
            <p class="temp">{{ item.temp }}°C</p>

            <!-- v-if: 25도 기준 라벨 분기 -->
            <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
            <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

            <!-- 버블링 방지(@click.stop) 후 상세보기 alert -->
            <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
              상세보기
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 상태바: 클릭 결과 표시 -->
    <div class="status-bar">{{ selectedCityInfo }}</div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital@0;1&family=Nanum+Myeongjo:wght@400;700&display=swap');

.mockup-wrapper {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  padding: 30px 0;
}

/* 검색창 */
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

/* 카드 3D 뒤집기 애니메이션 구조 */
.card-scene {
  width: 170px;
  max-width: 30%;
  aspect-ratio: 170 / 240;
  perspective: 1200px;
  cursor: pointer;
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  /* 탄성 있는 easing(cubic-bezier) -> 튕기듯 뒤집기 */
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card.is-flipped {
  /* 회전과 동시에 살짝 커지게 -> 카드가 들렸다가 놓이는 느낌 */
  transform: rotateY(180deg) scale(1.06);
}

/* 뒤집히는 순간 카드 전체 반짝임 효과 */
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

/* 마우스를 올리면 카드가 살짝 떠오르는 효과 */
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

/* 카드 뒷면 */
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

/* 카드 앞면 */
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

/* 배지 */
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

/* 상태바 */
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
