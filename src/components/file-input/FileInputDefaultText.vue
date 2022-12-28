<template>
  <div class="default-prompt-text" :title="names">
    <div class="parsing" v-if="parsing">Parsing...</div>
    <div v-else-if="count">{{count}} file{{count > 1 ? "s" : ""}}</div>
    <div v-else style="display: contents"><slot>Select file</slot></div>
  </div>
</template>

<script setup>
//todo split to 2 comps
//todo use props

import {count, fileEntries, parsing} from "./file-input-state-private.js";
import {computed} from "vue";
const names = computed(() => {
  return fileEntries.value.slice(0, 50).map(file => file.name).join("\n");
});
</script>

<style lang="scss" scoped>
.default-prompt-text {
  width: inherit;
  height: inherit;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  &:hover {
    //text-decoration: underline;
  }
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
