<template>
  <div class="search-wrapper">
    <div class="search">
      <input id="json-scan-search-input" type="text"
             v-model="search"
             ref="inputRef"
      >
      <button
          @click="onClearClick"
          @contextmenu.prevent="onContextMenu"
          title="Right click to clear and paste"
      >Clear</button>
    </div>
    <label for="json-scan-search-input" class="fuck-off-lighthouse">.</label>
  </div>
</template>

<script setup>
import {search, clearSearch} from "../core/search.js";
import {ref, onMounted, onUnmounted} from "vue";

const inputRef = ref();
function onClearClick() {
  clearSearch();
  inputRef.value.focus();
}

async function onContextMenu() {
  try {
    const text = await navigator.clipboard.readText();
    console.log("[clipboard] readText:", text);
    search.value = text;
  } catch (err) {
    console.error("[clipboard] read failed", err);
  }
}

let shiftTime = 0;
function doubleShiftHandler(event) {
  if (event.key !== "Shift") {
    return;
  }
  const now = Date.now();
  if (now - shiftTime < 250) {
    inputRef.value.focus();
  } else {
    shiftTime = now;
  }
}
onMounted(() => document.addEventListener("keydown", doubleShiftHandler));
onUnmounted(() => document.removeEventListener("keydown", doubleShiftHandler));

</script>

<style lang="scss" scoped>
/** reset */
input { padding: 0 0; }
button { padding: 0 0; }

.fuck-off-lighthouse {
  position: absolute;
  top:-1000px;
  left:-1000px;
}

.search {
  display: flex;
  height: 100%;
  label {
    display: contents;
  }
  input {
    height: 100%;
    flex-grow: 2;
    border: none;
    padding-left: 6px;
    border-bottom: transparent solid 1px;
    box-sizing: border-box;
    &:focus, &:hover {
      outline: none;
      border-bottom: var(--blue-1) solid 1px;
    }
  }
  button {
    height: 100%;
    padding: 0 6px;
    //outline: none;
    outline-width: 1px;
    outline-color: var(--blue-1);
    border: none;
    border-bottom: transparent solid 1px;
    border-left: var(--gray-2) solid 1px;
    box-sizing: border-box;
    background-color: var(--gray-1);
    &:hover {
      border-bottom: var(--blue-1) solid 1px;
      background: var(--blue-2);
    }
    &:active {
      background: var(--blue-3);
    }
  }
}
</style>
