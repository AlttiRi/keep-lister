<template>
  <span class="scanPath">
    <span class="parts" @click="goToRoot">
      <span class="part"       >{{part1}}</span>
      <span class="part spaced">{{part2}}</span>
    </span>
    <span class="spaced separator" v-if="showSep">{{separator}}</span>
  </span>
</template>

<script setup>
import {computed} from "vue";
import {scanRootPath, openedFolders, separator, openedFolder, openFolder} from "../store.js";

const root = computed(() => {
  const scanPath = [...scanRootPath.value, openedFolder.value.root.name];
  const str = scanPath.join(separator.value);
  if (str.startsWith("//")) { // for unix
    return str.slice(1);
  }
  return str;
});
const part1 = computed(() => {
  return [...root.value].slice(0, -1).join(""); // if ends with surrogate pair
});
const part2 = computed(() => {
  return [...root.value].slice(-1).join("");
});
const showSep = computed(() => {
  return (openedFolders.value.length - 1) && root.value !== "/";
});

function goToRoot() {
  openFolder(openedFolder.value.root);
}

</script>

<style lang="scss" scoped>
.scanPath {
  height: 100%;
  display: flex;
  align-items: center;
  .parts {
    height: 100%;
    display: flex;
    align-items: center;
    white-space: pre; /* to display tailing spaces */

    cursor: pointer;
    box-sizing: border-box;
    border-bottom: transparent solid 1px;
    &:hover {
      background-color: var(--blue-2);
      border-bottom: 1px solid var(--blue-1);
    }
    &:active {
      background: var(--blue-3);
    }
    .part {
      display: contents; // for correct selection by double click
    }
  }
  .spaced {
    letter-spacing: 2px;
  }
}
</style>
