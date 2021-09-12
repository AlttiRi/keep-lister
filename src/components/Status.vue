<template>
  <div class="status">
    <span>Item count: {{count}}</span>
    <span v-show="hoveredEntry">. Size: {{size}}</span>
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
