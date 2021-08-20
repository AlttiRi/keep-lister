<template>
<div class="address">
  <span class="scanPath" @click="goToRoot"
  >{{root.slice(0, -1)}}<span class="sep">{{root.slice(-1)}}</span></span>
  <span class="sep">{{sep}}</span>
  <AddressBar_Folder v-for="(folder, i) of openedFolders"
                     :entry="folder"
                     :index="i"
                     :count="openedFolders.length"
                     :separator="separator"
  />
</div>
</template>

<script>
import {
  scanRootPath,
  openedFolders,
  scanFolder,
  separator, search,
} from "../store.js";
import AddressBar_Folder from "./AddressBar_Folder.vue";
import {computed} from "vue";

export default {
  name: "Address",
  components: {
    AddressBar_Folder
  },
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
  }
}
.sep {
  letter-spacing: 2px;
  display: contents;
}
</style>
