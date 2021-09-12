<template>
  <div class="status">
    <span>Items count: {{count}}</span>
    <span v-show="hoveredEntry">. Hover item's size: {{size}}</span>
  </div>
</template>

<script setup>
import {count, hoveredEntry} from "../core/entries.js";
import {computed} from "vue";
import {bytesToSize} from "../util.js";

const size = computed(() => hoveredEntry.value?.size && bytesToSize(hoveredEntry.value.size));
</script>

<style scoped>

</style>
