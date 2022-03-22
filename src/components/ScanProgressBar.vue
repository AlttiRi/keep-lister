<template>
  <div class="scan-parsing-progress-component"
       v-if="scanParsing || show100"
       :style="{width: scanParsingProgress + '%'}"
  >
    <div class="visible"></div>
  </div>
</template>

<script setup>
import {scanParsing, scanParsingProgress} from "../core/state.js";
import {ref, watchEffect} from "vue";
import {sleep} from "../util.js";

const show100 = ref(false);
watchEffect(async () => {
  if (scanParsingProgress.value === 100) {
    show100.value = true;
    await sleep(16);
    show100.value = false;
  }
});
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
