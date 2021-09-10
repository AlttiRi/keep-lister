<template>
  <div class="file-select">
    <label>
      Select file
      <input type="file" accept="application/json,application/gzip" @change="onChange">
    </label>
    <hr>
  </div>
</template>

<script setup>
import {setScan} from "../core/folders.js";

function onChange(event) {
  /** @type {File} */
  const file = event.target.files[0];
  return setScan(file);
}
</script>

<style lang="scss" scoped>
.file-select label {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
input {
  display: none;
}
</style>
