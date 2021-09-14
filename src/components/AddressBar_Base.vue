<template>
  <span class="scanPath">
    <span class="parts" @click="goToRoot" :title="title">
      <span class="part"       >{{part1}}</span>
      <span class="part spaced">{{part2}}</span>
    </span>
    <span class="spaced separator" v-if="showSep">{{separator}}</span>
  </span>
</template>

<script setup>
//todo title
import {computed} from "vue";
import {scanRootPath, openedFolders, separator, openedFolder, openFolder, meta} from "../core/folders.js";
import {dateToDayDateString} from "../util.js";
import {debugMessageFromEntry} from "../core/debug.js";

const title = computed(() => {
  if (!meta.value) {
    return;
  }

  const {
      files, folders, symlinks,
      charDevs, blockDevs, fifos, sockets,
      total,
      platform, scanDate
  } = meta.value;

  function doString(o) {
    function pad(str) {
      const count = 3 - Math.trunc((str.length/4));
      return str + "\t".repeat(count);
    }
    return Object.entries(o)
        .map(([k, v]) => pad(k) + ": " + v)
        .join("\n");
  }
  const commonFiles = doString({files, folders, symlinks});
  const unusualFiles = doString({charDevs, blockDevs, fifos, sockets});
  const additional = doString({total, platform, scanDate: dateToDayDateString(scanDate)});

  let result;
  if (platform !== "win32") {
    result = [commonFiles, unusualFiles, additional].join("\n");
  } else {
    result = [commonFiles, additional].join("\n");
  }
  console.log(result);
  return result;
});

const root = computed(() => {
  const scanPath = [...scanRootPath.value, openedFolder.value.root.name];
  const str = scanPath.join(separator.value);
  if (str.startsWith("//")) { // for unix
    return str.slice(1);
  }
  if (meta.value?.platform === "win32") { // uppercase win drive letter // todo remove as unnecessary
    return str[0].toUpperCase() + str.slice(1);
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
  const root = openedFolder.value.root;
  debugMessageFromEntry(root);
  openFolder(root);
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
