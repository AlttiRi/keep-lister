<template>
  <div class="file-input-wrapper">
    <FileInput/>
  </div>
</template>

<script setup>
//todo: accept="application/json,application/gzip"

import {setScan} from "../core/folders.js";
import {clearSearch} from "../core/search.js";

import {watchEffect} from "vue";
import FileInput from "./file-input/FileInput.vue";
import {file} from "./file-input/file-input-state.js";

watchEffect(() => {
  if (file.value) {
    clearSearch();
    void setScan(file.value.file);
  }
});
</script>

<style lang="scss" scoped>
.file-input-wrapper {
  display: grid;
  justify-content: center;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  width: 100%;
  min-height: 35px;
}
</style>
