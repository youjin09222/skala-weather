<script setup>
// 부모로부터 현재 검색어를 props로 전달받아 표시만 담당
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

// 사용자가 입력할 때마다 부모에게 알리는 이벤트
defineEmits(['update-query'])
</script>

<template>
  <div class="search-inner">
    <h3>✦ 운명의 도시를 입력하소서 ✦</h3>
    <el-input
      :model-value="currentQuery"
      @update:model-value="$emit('update-query', $event)"
      placeholder="검색할 도시 이름 입력"
      clearable
      class="custom-search-input"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-inner h3 {
  font-family: 'Cinzel', serif;
  font-weight: 500;
  letter-spacing: 2px;
  font-size: 15px;
  margin-bottom: 12px;
  color: #d4af37;
}
.search-inner p {
  font-family: 'Nanum Myeongjo', serif;
  color: #e8d5a8;
}
.custom-search-input :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(212, 175, 55, 0.5);
  border-radius: 20px;
  box-shadow: none;
}
.custom-search-input :deep(.el-input__inner) {
  color: #f4e8d1;
  font-family: 'Nanum Myeongjo', serif;
  text-align: center;
}
.custom-search-input :deep(.el-input__inner::placeholder) {
  color: rgba(232, 213, 168, 0.75);
}
</style>
