<template>
  <div class="tabs">
    <FileInputWrapper class="tab"/>
    <div class="tab"></div>
  </div>
</template>

<script setup>
import FileInputWrapper from "./FileInputWrapper.vue";
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
