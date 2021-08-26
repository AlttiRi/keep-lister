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
import {setJson} from "../store.js";

async function onChange(event) {
  const jsonObj = JSON.parse(await event.target.files[0].text());
  setJson(jsonObj);
  globalThis.json = jsonObj;
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
