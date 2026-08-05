<script setup></script>

<template>
  <div class="app-shell">
    <nav class="navigation-bar">
      <RouterLink to="/" class="nav-item">🌙 날씨 점성술</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/about" class="nav-item">✨ 점성술 가이드</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
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
</style>
