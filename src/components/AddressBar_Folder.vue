<template>
  <span class="opened-folder"
        @click="onClick">
    <span class="part"       >{{part1}}</span>
    <span class="part spaced">{{part2}}</span>
  </span>
  <span class="separator spaced" v-if="!isLast">{{separator}}</span>
</template>

<script>
import {computed, toRefs} from "vue";
import {openedFolders, search, separator} from "../store.js";

export default {
  props: ["index", "count", "entry"],
  name: "AddressBar_Folder",
  setup(props) {
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

    return {
      isLast,
      part1,
      part2,
      onClick,
      separator,
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
  .part {
    display: contents;
  }
}
.spaced {
  letter-spacing: 2px;
}
</style>
