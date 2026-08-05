<script setup>
import UnitToggler from './components/weather/UnitToggler.vue'
</script>

<template>
  <div class="app-shell">
    <nav class="navigation-bar">
      <RouterLink to="/" class="nav-item">🔮 메인</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/national" class="nav-item">🗺️ 전국 날씨</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/world" class="nav-item">🌍 세계 날씨</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/about" class="nav-item">✨ 점성술 가이드</RouterLink>
      <UnitToggler />
    </nav>
    <main>
      <RouterView />
      <img src="/img_character.png" alt="날씨 점성술사" class="mascot-image" />
    </main>
  </div>
</template>

<style scoped>
main :deep(.mockup-wrapper),
main :deep(.world-wrapper),
main :deep(.detail-wrapper) {
  margin: 0;
}
main {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  padding-top: 40px;
}
.app-shell {
  min-height: 100vh;
  background-color: #000;
}
.navigation-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(160deg, #1a1a2e, #16213e);
  border-bottom: 1px solid rgba(212, 175, 55, 0.3);
  flex-wrap: wrap;
}
.nav-item {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  letter-spacing: 1px;
  font-size: 14px;
  color: #8c8395;
  text-decoration: none;
  transition: color 0.3s ease;
}
.nav-item.router-link-exact-active {
  color: #d4af37;
  text-shadow: 0 0 12px rgba(212, 175, 55, 0.6);
}
.divider {
  color: rgba(212, 175, 55, 0.4);
}
.mascot-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 12px;
  background: radial-gradient(ellipse at center, rgba(120, 90, 200, 0.15) 0%, transparent 70%);
}
.mascot-image {
  width: 400px;
  height: 400px;
  object-fit: contain;
  filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.4));
}
.mascot-caption {
  font-family: 'Cinzel', serif;
  font-size: 13px;
  letter-spacing: 1px;
  color: #d4af37;
  margin-top: 8px;
}
</style>
