<template>
  <span class="opened-folder"
        @click="onClick"
  >{{entry.name.slice(0, -1)}}<span class="sep">{{entry.name.slice(-1)}}</span></span>
  <span class="sep">{{isLast ? "" : separator}}</span>
</template>

<script>
import {computed, toRefs} from "vue";
import {openedFolders, search} from "../store.js";

export default {
  props: ["entry", "separator", "count", "index"],
  name: "AddressBar_Folder",
  setup(props) {
    const {index, count, entry} = toRefs(props);
    const isLast = computed(() => {
      return index.value + 1 === count.value;
    });

    function onClick() {
      console.log("folder", entry.value, index.value);
      while (openedFolders.length - 1 !== index.value) {
        console.log("pop", openedFolders.pop());
      }
      search.value = "";
    }

    return {
      isLast,
      onClick
    };
  }
}
</script>

<style lang="scss" scoped>
.opened-folder {
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  border-left: 0;
  border-right: 0;
  height: 100%;
  &:hover {
    background-color: var(--blue-2);
    border-top: 1px solid var(--gray-2);
    border-bottom: 1px solid var(--blue-1);
  }
  &:active {
    background: var(--blue-3);
  }
}
.sep {
  letter-spacing: 2px;
  display: contents;
}
</style>
