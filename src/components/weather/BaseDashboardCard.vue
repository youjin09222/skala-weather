<template>
  <div class="base-dashboard-card">
    <slot></slot>
  </div>
</template>

<style scoped>
.base-dashboard-card {
  background: linear-gradient(160deg, #1a1a2e, #16213e);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid rgba(212, 175, 55, 0.4);
  box-shadow: 0 0 24px rgba(120, 90, 200, 0.15);
}
</style>
