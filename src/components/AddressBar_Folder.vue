<template>
  <span class="opened-folder">
    <span class="parts" @click="onClick">
      <span class="part"       >{{part1}}</span>
      <span class="part spaced">{{part2}}</span>
    </span>
    <span class="separator spaced" v-if="!isLast">{{separator}}</span>
  </span>
</template>

<script setup>
import {computed, toRefs} from "vue";
import {openedFolders, search, separator} from "../store.js";

const props = defineProps(["index", "count", "entry"]);
const {index, count, entry} = toRefs(props);

const isLast = computed(() => {
  return index.value + 1 === count.value;
});
const part1 = computed(() => {
  return entry.value.name.slice(0, -1);
});
const part2 = computed(() => {
  return entry.value.name.slice(-1);
});

function onClick() {
  console.log("folder", entry.value, index.value);
  while (openedFolders.length - 1 !== index.value) {
    console.log("pop", openedFolders.pop());
  }
  search.value = "";
}
</script>

<style lang="scss" scoped>
.opened-folder {
  height: 100%;
  display: flex;
  align-items: center;
  .parts {
    height: 100%;
    display: flex;
    align-items: center;

    width: 100%;
    overflow-x: hidden;
    text-overflow: ellipsis;
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
    .part { // to use with max-width limitation // not works with  `display: contents;`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre;
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
