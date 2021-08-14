<template>
  <div class="tabs">
    <div class="tab">Select</div>
    <div class="tab">Tab 1</div>
  </div>
</template>

<script>
export default {
  name: "tabs"
}
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
