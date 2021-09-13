<template>
  <div class="status">
    <span>Items count: {{count}}</span>
    <span v-show="hoveredEntry">. Hover item's size: {{size}}</span>
  </div>
</template>

<script setup>
import {count, hoveredEntry} from "../core/entries.js";
import {computed} from "vue";
import {bytesToSizeWinLike} from "../util.js";

const size = computed(() => hoveredEntry.value?.size && bytesToSizeWinLike(hoveredEntry.value.size));
</script>

<style scoped>
.status {
  padding: 2px 2px 2px 6px;
}
</style>
