<script setup>
import { useConfigStore } from '@/stores/configStore'
const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <span class="unit-label">
      날씨단위: <strong>{{ configStore.unit === 'celsius' ? '섭씨(℃)' : '화씨(℉)' }}</strong>
    </span>
    <el-switch
      :model-value="configStore.unit === 'fahrenheit'"
      @change="configStore.toggleUnit"
      active-text="℉"
      inactive-text="℃"
      class="custom-switch"
    />
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Nanum Myeongjo', serif;
  font-size: 13px;
  color: #e8d5a8;
}
.toggle-btn {
  padding: 5px 12px;
  font-size: 12px;
  font-family: 'Nanum Myeongjo', serif;
  cursor: pointer;
  border: 1px solid rgba(212, 175, 55, 0.6);
  background: transparent;
  color: #d4af37;
  border-radius: 16px;
  transition: all 0.3s ease;
}
.toggle-btn:hover {
  background: rgba(212, 175, 55, 0.15);
  color: #f4e8d1;
}
.custom-switch :deep(.el-switch__core) {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(212, 175, 55, 0.5);
}
.custom-switch.is-checked :deep(.el-switch__core) {
  background-color: #d4af37;
}
.custom-switch :deep(.el-switch__label) {
  color: #d4af37;
}
</style>
