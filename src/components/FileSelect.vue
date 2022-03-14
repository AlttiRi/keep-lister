<template>
  <div class="file-input-wrapper">
    <FileInput :accept="`application/json,application/gzip`" :multiple="false"/>
  </div>
</template>

<script setup>
import {setScan} from "../core/folders.js";
import {clearSearch} from "../core/search.js";

import {watch} from "vue";
import FileInput from "./file-input/FileInput.vue";
import {file} from "./file-input/file-input-state.js";

watch(file, () => {
  if (file.value) {
    clearSearch();
    void setScan(file.value.file);
  }
});
</script>

<style lang="scss" scoped>

::v-deep(.file-input) {
  border-right: 0;
  border-left:  0;
}
.file-input-wrapper {
  display: grid;
  justify-content: center;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  width: 100%;
  min-height: 35px;
}
</style>
