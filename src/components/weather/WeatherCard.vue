<script setup>
import { ref, computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

// 부모로부터 도시 하나의 정보를 props로 전달받음
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 카드 선택, 상세보기 클릭 -> 두 이벤트를 부모에게 전달
const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

// 스토어의 단위 설정에 맞춰 표시할 온도를 계산 - 원본 데이터는 항상 섭씨로 유지
const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

// 카드 뒤집힘 여부 -> 컴포넌트 자체 로컬 상태로 관리
const isFlipped = ref(false)

const handleCardClick = (cityName) => {
  isFlipped.value = !isFlipped.value
  emit('select-card', `${cityName}이 선택되었습니다.`)
}

const cardIcon = (status) => {
  if (status.includes('맑')) return '☀️'
  if (status.includes('비')) return '🌧️'
  if (status.includes('눈')) return '❄️'
  if (status.includes('구름')) return '☁️'
  return '🌫️'
}
</script>

<template>
  <div class="card-scene" @click="handleCardClick(cityItem.name)">
    <div class="card" :class="{ 'is-flipped': isFlipped }">
      <div class="card-face card-back">
        <span class="back-symbol">✦</span>
      </div>
      <div class="card-face card-front">
        <div class="card-icon">{{ cardIcon(cityItem.status) }}</div>
        <h4>{{ cityItem.name }}</h4>
        <p class="temp">{{ displayTemp }}{{ configStore.unitSymbol }}</p>
        <span v-if="cityItem.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
        <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>
        <button
          class="btn-detail"
          @click.stop="emit('click-detail', cityItem.name, cityItem.status)"
        >
          상세보기
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
  font-family: 'Nanum Myeongjo', serif;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  margin: 6px 0;
  letter-spacing: 0;
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
</style>
