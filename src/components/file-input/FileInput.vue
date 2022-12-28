<template>
<div
    class="file-input"
    ref="fileInputElem"
    :class="{'drop-hover': dropHover}"
    tabindex="0"
    @keydown="onKeyDown"
>
  <label>
    <input type="file"
           :accept="accept"
           :multiple="multiple"
           @change="onFileInputChange"
           style="display: none"
    >

    <span class="content hover" v-if="dropHover">
      <slot name="hover"><FileInputDefaultHoverText/></slot>
    </span>
    <span class="content selected" v-else-if="file && !parsing">
      <slot name="selected"><FileInputDefaultText/></slot>
    </span>
    <span class="content prompt" v-else>
      <slot name="prompt"><FileInputDefaultText/></slot>
    </span>

  </label>
  <teleport to="body">
    <div class="file-input-hover-modal" :class="{'drop-hover': dropHover}"></div>
  </teleport>
</div>
</template>

<script setup>
import FileInputDefaultHoverText from "./FileInputDefaultHoverText.vue";
import FileInputDefaultText from "./FileInputDefaultText.vue";

import {ref, toRefs, onMounted, computed, onBeforeUnmount} from "vue";
import {
  parsing,
  file,
  dropHover,
  setFiles,
  setDataTransfer,
  setDataTransferHover,
  resetDataTransferHover, resetDtItems
} from "./file-input-state-private.js";

const props = defineProps({
  globalDropZone: {
    type: Boolean,
    default: true
  },
  accept: {
    type: String,
    default: "*/*"
  },
  multiple: {
    type: Boolean,
    default: true
  },
});
const {
  /** @type {import("vue").Ref<Boolean>} */
  globalDropZone,
} = toRefs(props);


/** @param {Event} event */
function onFileInputChange(event) {
  const fileElem = event.target;
  setFiles(fileElem.files);
  resetDtItems();
}


/** @type {import("vue").Ref<HTMLElement|null>} */
const fileInputElem = ref(null);
/** @type {import("vue").Ref<HTMLElement>} */
const dropZone = computed(() => {
  if (globalDropZone.value) {
    return document.body;
  }
  return fileInputElem.value;
});
onMounted(() => {
  if (!globalDropZone.value) {
    disableDragOverNotDropZone();
  }
  initListeners();
});
onBeforeUnmount(() => {
  removeListeners();
});

function stopEvent(event) {
  event.preventDefault();
  event.stopPropagation();
}

function initListeners() {
  dropZone.value.addEventListener("drop", onDrop);
  dropZone.value.addEventListener("dragover", onDragOver);
  dropZone.value.addEventListener("dragleave", onDragLeave);
  dropZone.value.addEventListener("dragenter", onDragEnter);
}
function removeListeners() {
  dropZone.value.addEventListener("drop", onDrop);
  dropZone.value.addEventListener("dragover", onDragOver);
  dropZone.value.addEventListener("dragleave", onDragLeave);
  dropZone.value.addEventListener("dragenter", onDragEnter);
}
function onDrop(event) {
  stopEvent(event);
  dropHover.value = false;
  setDataTransfer(event.dataTransfer);
}
function onDragOver(event) {
  stopEvent(event);
  event.dataTransfer.dropEffect = "copy";
}
function onDragEnter(event) {
  stopEvent(event);
  if (!dropHover.value) {
    dropHover.value = true;
  } else {
    return;
  }
  setDataTransferHover(event.dataTransfer);
}
function onDragLeave(event) {
  stopEvent(event);
  if (!dropZone.value.contains(event.relatedTarget)) {
    dropHover.value = false;
    resetDataTransferHover();
  }
}

function disableDragOverNotDropZone() {
  /** @param {DragEvent} event */
  const dragOverCallback = event => {
    if (!dropZone.value.contains(event.target)) {
      stopEvent(event);
      event.dataTransfer.dropEffect = "none";
    }
  };
  document.body.addEventListener("dragover", dragOverCallback);
}

function onKeyDown(event) {
  if (event.key === "Enter") {
    fileInputElem.value.querySelector("label").click();
  }
}

</script>

<style lang="scss" scoped>
.file-input {
  transition: background-color 0.1s;
  border: solid 1px var(--file-input-border);
  box-sizing: border-box;
  &.drop-hover {
    background-color: var(--drop-file-hover);
    transition: background-color 0.1s;
  }
  &:hover {
    background-color: var(--drop-hover);
  }
  &:active {
    background-color: var(--drop-active);
  }
}
.file-input, label, .content {
  width: 100%;
  height: 100%;
}

.file-input-hover-modal {
  height: 50px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  pointer-events: none;
  background-image: linear-gradient(to top, rgba(0,0,0,0.15), rgba(0,0,0,0.005));

  transition: opacity 0.25s ease-out;
  opacity: 0;
  &.drop-hover {
    opacity: 1;
  }
}
</style>










