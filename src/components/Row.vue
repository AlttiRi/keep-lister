<template>
  <tr class="row"
      @click="onClick"
      @mousedown="onMousedown"
      @mouseover="onMouseover"
      @mouseleave="onMouseleave"
      :title="title"
      :class="{error}"
  >
      <td class="icon">{{icon}}</td>
      <td class="name">{{entry.name}}</td>
      <td class="size" :class="sizeClass">{{size}}</td>
      <td class="mtime">{{mtime}}</td>
<!--      <td class="type">{{entry.type}}</td>-->
<!--      <td class="filler"></td>-->
  </tr>
</template>

<script setup>
import {toRefs, computed} from "vue";
import {meta, openedFolder, openFolder, parsingStateNumber, separator} from "../core/folders.js";
import {bytesToSizeWinLike, dateToDayDateTimeString, isImage, isVideo} from "../util.js";
import {hoveredEntry} from "../core/entries.js";
import {debugMessageFromEntry} from "../core/debug.js";

const props = defineProps(["entry"]);

const size = computed(() => {
  if (parsingStateNumber.value) {
    // force recomputing on change
  }
  return entry.value.hasErrors ? "" : bytesToSizeWinLike(entry.value.size);
});

const sizeClass = computed(() => {
  if (size.value === "0 B") {
    return "Z";
  }
  return size.value.split(" ")[1];
});

/** @type {import("vue").Ref<SimpleEntry>} */
const entry = toRefs(props).entry;

/** @type {import("vue").Ref<Boolean>} */
const error = computed(() => {
  return entry.value.hasErrors;
});

/** @type {import("vue").ComputedRef<String>} */
const mtime = computed(() => {
  if (entry.value.mtime === undefined) {
    return "";
  }
  const time = dateToDayDateTimeString(entry.value.mtime, false);
  return time.slice(0, -3); // trim seconds
});

/** @type {import("vue").ComputedRef<String>} */
const title = computed(() => {
  if (entry.value.hasErrors) {
    return JSON.stringify(entry.value.errors[0], null, " ");
  }
  if (entry.value.type === "symlink") {
    return entry.value.pathTo;
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
  debugMessageFromEntry(entry.value);

  if (entry.value.type === "folder") {
    openFolder(entry.value);
  }
}

/** @param {MouseEvent} event */
function onMousedown(event) {
  const MIDDLE_BUTTON = 1;
  const RIGHT_BUTTON = 2;
  if (event.button === MIDDLE_BUTTON) {
    event.preventDefault();
    console.log(
        entry.value,
        [...meta.value.path,...entry.value.path.map(e => e.name)].join(separator.value).replace("//", "/")
    );

    if (openedFolder.value !== entry.value.parent) {
      openFolder(entry.value.parent);
    }
  }
}

function onMouseover(event) {
  hoveredEntry.value = entry.value;
}
function onMouseleave(event) {
  hoveredEntry.value = null;
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  min-height: 28px;
  display: flex;
  align-items: center;
  &:hover {
    background-color: var(--blue-2);
  }
  * {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  td {
    &.icon {
      border-left: 2px solid transparent;
      width: 24px;
      text-align: center;
      user-select: none;
    }
    &.name {
      display: block;
      //width: 880px; // gets it from the parent
      white-space: pre; // to display tailing spaces
    }
    &.size {
      text-align: end;
      min-width: 80px;
      &.Z {
        color: #888;
      }
      &.B {
        color: #666;
      }
      &.KB {
        color: #0b0;
      }
      &.MB {
        color: #0070dd;
      }
      &.GB {
        color: #a335ee;
      }
      &.TB {
        color: #ff8000;
      }
    }
    &.mtime {
      text-align: end;
      width: 145px;
      color: #777;
    }
    &.type {
      text-align: end;
      width: 58px;
      user-select: none;
    }
    //&.filler {
    //  width: inherit;
    //}
  }
  &.error {
    .icon {
      border-left: 2px solid red;
    }
  }
}
</style>
