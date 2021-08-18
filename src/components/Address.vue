<template>
<div class="address">
  <span class="scanPath" @click="goToRoot">{{root}}</span>
  {{sep}}
  <span class="openFolders">{{openFolders}}</span>
</div>
</template>

<script>
import {
  scanRootPath,
  openedFolders,
  scanFolder,
  separator, search,
} from "../store.js";
import {computed} from "vue";

export default {
  name: "Address",
  setup() {
    const sep = computed(() => {
      return openedFolders.length ? separator : "";
    });
    const root = computed(() => {
      const scanPath = [...scanRootPath.value, scanFolder.value.name];
      return scanPath.join(separator);
    });
    const openFolders = computed(() => {
      return openedFolders.map(entry => entry.name).join(separator);
    });

    function goToRoot() {
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
      sep,
    };
  }
}
</script>

<style lang="scss" scoped>
.address {
  display: flex;
  align-items: center;
  padding-left: 6px;
  .scanPath {
    //box-sizing: border-box;
    //padding: 1px;
    border: 1px solid transparent;
    &:hover {
      border: 1px solid #8ca0ff;
    }
  }
}
</style>
