<template>
  <span class="scanPath" @click="goToRoot">
    <span class="parts">
      <span class="part"       >{{part1}}</span>
      <span class="part spaced">{{part2}}</span>
    </span>
    <span class="spaced separator" v-if="showSep">{{separator}}</span>
  </span>
</template>

<script setup>
import {computed} from "vue";
import {scanRootPath, openedFolders, scanFolder, separator, search} from "../store.js";

const root = computed(() => {
  const scanPath = [...scanRootPath.value, scanFolder.value.name];
  const str = scanPath.join(separator.value);
  if (str.startsWith("//")) { // for unix
    return str.slice(1);
  }
  return str;
});
const openFolders = computed(() => {
  return openedFolders.map(entry => entry.name).join(separator.value);
});
const part1 = computed(() => {
  return root.value.slice(0, -1);
});
const part2 = computed(() => {
  return root.value.slice(-1);
});
const showSep = computed(() => {
  return openedFolders.length && root.value !== "/";
});

function goToRoot() {
  console.log("folder", scanFolder.value);
  search.value = "";
  while (openedFolders.length) {
    console.log("pop", openedFolders.pop());
  }
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
