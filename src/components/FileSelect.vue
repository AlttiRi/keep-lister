<template>
  <div class="file-select">
    <label>
      Select file
      <input type="file" accept="application/json" @change="onChange">
    </label>
    <hr>
  </div>
</template>

<script setup>
import {setJson} from "../core/folders.js";

async function onChange(event) {
  const jsonObj = JSON.parse(await event.target.files[0].text());
  setJson(jsonObj);
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
