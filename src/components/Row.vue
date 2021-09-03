<template>
  <tr class="row"
      @click="onClick"
      @mousedown="onMousedown"
      :title="title"
      :class="{error}"
  >
      <td class="icon">{{icon}}</td>
      <td class="name">{{entry.name}}</td>
<!--      <td class="type">{{entry.type}}</td>-->
  </tr>
</template>

<script setup>
import {toRefs, computed} from "vue";
import {openFolder} from "../core/folders.js";
import {isImage, isVideo} from "../util.js";

const props = defineProps(["entry"]);

/** @type {import("vue").Ref<SimpleEntry>} */
const entry = toRefs(props).entry;

/** @type {import("vue").Ref<Boolean>} */
const error = computed(() => {
  return entry.value.hasErrors;
});

/** @type {import("vue").ComputedRef<String>} */
const title = computed(() => {
  if (entry.value.hasErrors) {
    return JSON.stringify(entry.value.errors[0], null, " ");
  }
  if (entry.value.type === "symlink") {
    return entry.value.meta?.pathTo;
  }
});

/** @type {import("vue").Ref<String>} */
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

/** @param {MouseEvent} event */
function onMousedown(event) {
  const MIDDLE_BUTTON = 1;
  if (event.button === MIDDLE_BUTTON && entry.value.type === "folder") {
    console.log("MIDDLE_BUTTON on a folder", event);
  }
}

</script>

<style lang="scss" scoped>
.row {
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
    max-width: 0; // no scroll for long names
    &.icon {
      border-left: 2px solid transparent;
      width: 2.5%;
      min-width: 22px;
      user-select: none;
    }
    &.name {
      width: 100%;
      white-space: pre; // to display tailing spaces
    }
    &.type {
      min-width: 58px;
      user-select: none;
    }
  }
  &.error {
    .icon {
      border-left: 2px solid red;
    }
  }
}
</style>
