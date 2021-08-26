<template>
  <div class="content"
       @contextmenu="onContextMenu"
  >
    <table class="grid">
      <Row v-for="entry of listLimited" :entry="entry"/>
    </table>
  </div>
</template>

<script setup>
import Row from "./Row.vue";
import {back, listLimited} from "../store.js";

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
</style>
