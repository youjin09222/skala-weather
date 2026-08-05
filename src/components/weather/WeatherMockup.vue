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
      <h3>🔮 그대의 발길이 닿을 곳을 알려주소서</h3>
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
          <div class="card-face card-back">🔮</div>

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
.mockup-wrapper {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.search-box {
  background: #2c2418;
  color: #e8d5a8;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #d4af37;
}
.search-box input {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #d4af37;
  background: #fdf6e3;
}

.card-deck {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

/* 카드 3D 뒤집기 애니메이션 구조 */
.card-scene {
  width: 160px;
  height: 230px;
  perspective: 1000px; /* 원근감 설정 */
  cursor: pointer;
}
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
}
.card.is-flipped {
  transform: rotateY(180deg);
}
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden; /* 뒷면이 비치지 않도록 처리 */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  box-sizing: border-box;
}
.card-back {
  background: radial-gradient(circle, #4b3a1a, #2c2418);
  border: 2px solid #d4af37;
  color: #d4af37;
  font-size: 40px;
}
.card-front {
  background: linear-gradient(160deg, #fdf6e3, #f0e4c0);
  border: 2px solid #d4af37;
  transform: rotateY(180deg); /* 미리 뒤집어놔야 최종적으로 정방향으로 보임 */
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
.card-icon {
  font-size: 32px;
}
.temp {
  font-size: 18px;
  font-weight: bold;
  margin: 4px 0;
}
.badge {
  display: inline-block;
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 4px;
  color: white;
  margin-bottom: 6px;
}
.hot {
  background-color: #b03a2e;
}
.cool {
  background-color: #2e5c8a;
}
.btn-detail {
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #d4af37;
  background: #fdf6e3;
  border-radius: 4px;
}

.status-bar {
  background: #2c2418;
  color: #d4af37;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
}
</style>
