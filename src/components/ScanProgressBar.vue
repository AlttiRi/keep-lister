<template>
  <div class="scan-parsing-progress-component"
       v-if="scanParsing"
       :style="{width: scanParsingProgress + '%'}"
  >
    <div class="visible"></div>
  </div>
</template>

<script setup>
import {scanParsing, scanParsingProgress} from "../core/state.js";
</script>

<style lang="scss" scoped>
.scan-parsing-progress-component {
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  > div {
    width: 100%;
  }
  .visible {
    background-color: var(--blue-1);
    height: 4px;
  }
}
</style>
