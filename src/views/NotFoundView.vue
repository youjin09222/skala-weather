<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-wrapper">
    <div class="not-found-card">
      <div class="icon">✦❓</div>
      <h2>📜 찢겨 나간 마법의 페이지입니다.</h2>
      <p>찾으시는 기록은 존재하지 않습니다.</p>
      <button class="btn-detail" @click="goHome">날씨 메인으로 이동</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-wrapper {
  display: flex;
  justify-content: center;
  padding: 60px 20px;
}
.not-found-card {
  background: radial-gradient(circle at 50% 40%, #2c2a4a 0%, #12101f 80%);
  border: 1px solid rgba(212, 175, 55, 0.5);
  border-radius: 14px;
  padding: 40px;
  text-align: center;
  color: #e8d5a8;
  font-family: 'Nanum Myeongjo', serif;
}
.icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.not-found-card h2 {
  font-family: 'Cinzel', serif;
  color: #d4af37;
  margin-bottom: 8px;
}
.btn-detail {
  margin-top: 20px;
  padding: 8px 20px;
  font-size: 13px;
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
