import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 날씨 단위(섭씨/화씨) 설정을 앱 전체가 공유
export const useConfigStore = defineStore('config', () => {
  // state: 현재 선택된 단위, 'celsius' 또는 'fahrenheit'
  const unit = ref('celsius')

  // getters: 현재 단위에 맞춰 화면에 뿌릴 기호를 계산 및 반환
  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  // actions: 버튼 클릭 시 'celsius' <-> 'fahrenheit'를 서로 토글
  function toggleUnit() {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  }

  return {
    unit,
    unitSymbol,
    toggleUnit,
  }
})
