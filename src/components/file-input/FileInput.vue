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
           :nwdirectory="nwdirectory"
           ref="templateInputElem"
    >

    <span class="content hover" v-if="dropHover">
      <slot name="hover"><FileInputDefaultHoverText :state="state"/></slot>
    </span>
    <span class="content selected" v-else-if="file && !parsing">
      <slot name="selected"><FileInputDefaultText :state="state"/></slot>
    </span>
    <span class="content prompt" v-else>
      <slot name="prompt"><FileInputDefaultText :state="state"/></slot>
    </span>

  </label>
  <teleport to="body">
    <div class="file-input-hover-modal" :class="{'drop-hover': dropHover}"></div>
  </teleport>
</div>
</template>

<script setup lang="ts">
import FileInputDefaultHoverText from "./FileInputDefaultHoverText.vue";
import FileInputDefaultText from "./FileInputDefaultText.vue";
import {FileInputState} from "./file-input-state";

import {
  ref, toRefs, onMounted, computed, onBeforeUnmount, watchEffect,
  PropType, Ref, ComputedRef
} from "vue";

const templateInputElem: Ref<HTMLInputElement> = ref(null);

const props = defineProps({
  globalDropZone: {
    type: Boolean,
    default: true
  },
  dropZoneSelector: {
    type: String
  },
  accept: {
    type: String,
    default: "*/*"
  },
  multiple: {
    type: Boolean,
    default: true
  },
  state: {
    type: Object as PropType<FileInputState>,
    required: true
  },
  nwdirectory: {
    type: Boolean,
    default: false
  }
});

const {
  globalDropZone,
  dropZoneSelector,
  nwdirectory,
} = toRefs(props);

const {
  parsing,
  file,
  dropHover,
  setFiles,
  setDataTransfer,
  setDataTransferHover,
  resetDataTransferHover,
  isNwDirectory,
  inputElem,
} = props.state.private;


watchEffect(() => {
  isNwDirectory.value = nwdirectory.value;
});
watchEffect(() => {
  inputElem.value = templateInputElem.value;
});

function onFileInputChange(event: Event) {
  const fileElem = event.target as HTMLInputElement;
  setFiles(fileElem.files);
}

const fileInputElem: Ref<HTMLElement> = ref(null);

const dropZone: ComputedRef<HTMLElement> = computed(() => {
  if (dropZoneSelector.value) {
    return document.querySelector(dropZoneSelector.value);
  } else
  if (globalDropZone.value) {
    return document.body;
  } else
  return fileInputElem.value;
});

onMounted(() => {
  initListeners();
});
onBeforeUnmount(() => {
  removeListeners();
});

function initListeners() {
  dropZone.value.addEventListener("drop", onDrop);
  dropZone.value.addEventListener("dragover", onDragOver);
  dropZone.value.addEventListener("dragleave", onDragLeave);
  dropZone.value.addEventListener("dragenter", onDragEnter);

  document.body.addEventListener("dragover", dragOverCallback);
}
function removeListeners() {
  dropZone.value.removeEventListener("drop", onDrop);
  dropZone.value.removeEventListener("dragover", onDragOver);
  dropZone.value.removeEventListener("dragleave", onDragLeave);
  dropZone.value.removeEventListener("dragenter", onDragEnter);

  document.body.removeEventListener("dragover", dragOverCallback);
}

function stopEvent(event: Event) {
  event.preventDefault();
  event.stopPropagation();
}

function onDrop(event: DragEvent) {
  stopEvent(event);
  dropHover.value = false;
  setDataTransfer(event.dataTransfer);
}
function onDragOver(event: DragEvent) {
  stopEvent(event);
  event.dataTransfer.dropEffect = "copy";
}
function onDragEnter(event: DragEvent) {
  stopEvent(event);
  if (!dropHover.value) {
    dropHover.value = true;
  } else {
    return;
  }
  setDataTransferHover(event.dataTransfer);
}
function onDragLeave(event: DragEvent) {
  stopEvent(event);
  if (!dropZone.value.contains(event.relatedTarget as Node)) {
    dropHover.value = false;
    resetDataTransferHover();
  }
}

function dragOverCallback(event: DragEvent) {
  if (!dropZone.value.contains(event.target as Node)) {
    stopEvent(event);
    event.dataTransfer.dropEffect = "none";
  }
}

function onKeyDown(event: KeyboardEvent) {
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










