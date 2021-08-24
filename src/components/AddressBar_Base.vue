<template>
  <span class="scanPath" @click="goToRoot">
    <span class="part"       >{{part1}}</span>
    <span class="part spaced">{{part2}}</span>
  </span>
  <span class="spaced separator" v-if="openedFolders.length && root !== `/`">{{separator}}</span>
</template>

<script>
import {computed} from "vue";
import {scanRootPath, openedFolders, scanFolder, separator, search} from "../store.js";

export default {
  name: "AddressBar_Base",
  setup() {
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

    function goToRoot() {
      console.log("folder", scanFolder.value);
      search.value = "";
      while (openedFolders.length) {
        console.log("pop", openedFolders.pop());
      }
    }

    return {
      root,
      openFolders,
      separator,
      goToRoot,
      openedFolders,
      part1,
      part2,
    };
  }
}
</script>

<style lang="scss" scoped>
.scanPath {
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 100%;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  &:hover {
    background-color: var(--blue-2);
    border-top: 1px solid var(--gray-2);
    border-bottom: 1px solid var(--blue-1);
  }
  &:active {
    background: var(--blue-3);
  }
  .part {
    display: contents;
  }
}
.spaced {
  letter-spacing: 2px;
}
</style>