<template>
  <div class="home" @click="onClick" @contextmenu="onContextMenu" :class="{active: isHomeOpened}" v-if="show">
    Home
  </div>
</template>

<script setup>
import {home, openFolder, isHomeOpened, clearHome} from "../core/folders.js";
import {computed} from "vue";
import {debugMessageFromEntry} from "../core/debug.js";

const show = computed(() => {
  return home.value?.children?.length > 1;
});

function onClick() {
  debugMessageFromEntry(home.value);
  openFolder(home.value);
}
function onContextMenu(event) {
  event.preventDefault();
  clearHome();
}
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 35px;

  border: var(--gray-2) solid 1px;
  border-right: 0;
  border-left: 0;
  box-sizing: border-box;
  &:hover {
    background-color: var(--drop-hover);
    cursor: pointer;
  }
  &:active {
    background-color: var(--drop-active);
  }
  &.active {
    border-width: 2px;
  }
}
</style>
