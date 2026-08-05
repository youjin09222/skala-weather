<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goToDashboard = () => {
  router.push('/')
}
</script>

<template>
  <div class="about-wrapper">
    <div class="about-card">
      <h3>✦ 서비스 소개 ✦</h3>
      <p>
        본 앱은 <strong>Vue 3</strong> 및 <strong>Vue Router 4</strong> 기반으로 제작된 기상 관측
        기록과 타로가 만난 레트로 날씨 예보 대시보드입니다.
      </p>

      <ul>
        <li>
          <strong>매끄러운 덱 전환</strong>
          <span>새로고침 없이 페이지가 부드럽게 펼쳐지는 클라이언트 라우팅</span>
        </li>
        <li>
          <strong>카드 플립 액션</strong>
          <span>3D 카드 애니메이션으로 오늘의 날씨 카드를 직접 뽑는 재미</span>
        </li>
        <li>
          <strong>빠른 덱 서치</strong>
          <span>한글 검색과 실시간 필터링으로 원하는 지역의 카드 즉시 탐색</span>
        </li>
      </ul>

      <button class="btn-detail" @click="goToDashboard">대시보드 홈으로 이동</button>
    </div>
  </div>
</template>

<style scoped>
.about-wrapper {
  max-width: 500px;
  margin: 40px auto;
}
.about-card {
  background: linear-gradient(160deg, #1a1a2e, #16213e);
  border: 1px solid rgba(212, 175, 55, 0.4);
  border-radius: 14px;
  padding: 30px;
  color: #e8d5a8;
  font-family: 'Nanum Myeongjo', serif;
  box-shadow: 0 0 24px rgba(120, 90, 200, 0.15);
}
.about-card h3 {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  letter-spacing: 2px;
  color: #d4af37;
  margin-bottom: 16px;
}
.about-card ul {
  text-align: left;
  padding-left: 20px;
  margin: 16px 0;
}
.about-card li {
  margin-bottom: 14px;
  line-height: 1.5;
}
.about-card li strong {
  display: block;
  color: #d4af37;
  font-size: 14px;
  margin-bottom: 2px;
}
.about-card li span {
  display: block;
  font-size: 13px;
  color: #c9bda0;
}
.btn-detail {
  margin-top: 10px;
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
