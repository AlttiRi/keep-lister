<template>
  <div class="tabs">
    <FileSelect class="tab"/>
    <div class="tab">Tab 1</div>
  </div>
</template>

<script>
import FileSelect from "./FileSelect.vue";
export default {
  name: "tabs",
  components: {
    FileSelect
  },
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
