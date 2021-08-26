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

<script setup>
import {toRefs, computed} from "vue";
import {openFolder} from "../store.js";
import {isImage, isVideo} from "../util.js";

const props = defineProps(["entry"]);
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
  return "👾";
});

function onClick(event) {
  if (entry.value.type === "folder") {
    console.log("openFolder", entry.value);
    openFolder(entry.value);
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

</script>

<style lang="scss" scoped>
tr.row {
  width: 100%;
  &:hover {
    background-color: var(--blue-2);
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
      white-space: pre; // to display tailing spaces
    }
    &.type {
      width: 15%;
      user-select: none;
    }
  }
}
</style>
