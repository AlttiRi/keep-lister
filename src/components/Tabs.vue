<template>
  <div class="tabs">
    <FileSelect class="tab"/>
    <div class="tab">Tab 1</div>
  </div>
</template>

<script setup>
import FileSelect from "./FileSelect.vue";
</script>

<style scoped>
.tabs {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tab {
  padding: 6px;
}
</style>
