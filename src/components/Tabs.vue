<template>
  <div class="tabs">
    <FileInputWrapper class="tab"/>
    <Home class="tab"/>
  </div>
</template>

<script setup>
import FileInputWrapper from "./FileInputWrapper.vue";
import Home from "./Home.vue";
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
