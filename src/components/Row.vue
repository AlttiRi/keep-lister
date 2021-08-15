<template>
  <tr class="row"
       @click="onClick"
       @mousedown="onMousedown"
  >
      <td class="icon">{{icon}}</td>
      <td class="name">{{entry.name}}</td>
<!--      <td class="type">{{entry.type}}</td>-->
  </tr>
</template>

<script>
import {toRefs, computed} from "vue";
import {
  openFolder,
} from "../store.js";
import {isImage, isVideo} from "../util.js";

export default {
  name: "Row",
  props: ["entry"],
  setup(props) {
    const {entry} = toRefs(props);
    const icon = computed(() => {
      if (entry.value.type === "folder") {
        return "📁";
      } else if (entry.value.type === "file") {
        if (isVideo(entry.value.name)) {
          return "🎦";
        } else if (isImage(entry.value.name)) {
          return "🖼";
        }
        return "📄";
      } else if (entry.value.type === "symlink") {
        return "🔗";
      }
    });

    function onClick(event) {
      if (entry.value.type === "folder") {
        console.log("openFolder");
        openFolder(entry.value.name);
      } else {
        console.log(entry.value);
      }
    }

    function onMousedown(event) {
      const MIDDLE_BUTTON = 2;
      if (event.which === MIDDLE_BUTTON && entry.value.type === "folder") {
        console.log("MIDDLE_BUTTON on a folder");
      }
    }

    return {entry, icon, onClick, onMousedown};
  }
}
</script>

<style lang="scss" scoped>
tr.row {
  width: 100%;
  &:hover {
    background-color: aliceblue;
  }
  * {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  td {
    max-width: 0;
    &.icon {
      width: 2.5%;
      min-width: 22px;
      user-select: none;
    }
    &.name {
      width: 95%;
    }
    &.type {
      width: 15%;
      user-select: none;
    }
  }
}
</style>
