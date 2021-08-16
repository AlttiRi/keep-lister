<template>
<div class="address">
  <span class="scanPath" @click="onClick">{{root}}{{separator}}</span>
  <span class="openFolders">{{openFolders}}</span>
</div>
</template>

<script>
import {
  scanRootPath,
  openedFolders,
  openedFolder,
} from "../store.js";
import {computed} from "vue";

const separator = "\\"; //todo store the path separator in json / or \

export default {
  name: "Address",
  setup() {
    const root = computed(() => {
      return scanRootPath.value.join(separator);
    });
    const openFolders = computed(() => {
      return openedFolders.map(entry => entry.name).join(separator);
    });

    function onClick() {
      openedFolder.value = openedFolders[0];
      while (openedFolders.length !== 1) {
        console.log("pop", openedFolders.pop());
      }
    }

    return {
      root,
      openFolders,
      separator,
      onClick,
      openedFolders
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
