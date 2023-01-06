<template>
  <div class="file-input-wrapper">
    <FileInput :accept="`application/json,application/gzip`" :multiple="true" :state="fileInputState"/>
  </div>
</template>

<script setup>
import FileInput from "./file-input/FileInput.vue";
import {fileInputState} from "../core/file-input-state";
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
