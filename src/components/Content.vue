<template>
  <div class="content"
       @contextmenu="onContextMenu"
  >
    <table class="grid">
      <Row v-for="entry of listLimited" :entry="entry"/>
    </table>
    <div class="empty" v-if="empty">
      <span>The folder is empty.</span>
    </div>
  </div>
</template>

<script setup>
import Row from "./Row.vue";
import {back, empty, listLimited} from "../store.js";

function onContextMenu(event) {
  event.preventDefault();
  back();
}
</script>

<style scoped>
.content, table {
  width: 100%;
  overflow: auto;
}
.empty {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--gray-2);
}
</style>
