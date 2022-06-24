<template>
  <div class="file-input-wrapper">
    <FileInput :accept="`application/json,application/gzip`" :multiple="true"/>
  </div>
</template>

<script setup>
import {clearHome, home, openFolder, setScan} from "../core/folders.js";

import {watch} from "vue";
import FileInput from "./file-input/FileInput.vue";
import {fileEntries} from "./file-input/file-input-state.js";

watch(fileEntries, async () => {
  clearHome();
  for (const {file} of fileEntries.value) {
    await setScan(file);
  }
  if (fileEntries.value.length > 1) {
    openFolder(home.value);
  }
});
</script>

<style lang="scss" scoped>

::v-deep(.file-input) {
  border-right: 0;
  border-left:  0;
  outline-width: 1px;
  outline-color: var(--blue-1);
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
