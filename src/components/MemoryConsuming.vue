<template>
  <div class="memory-consuming-component"
       v-if="isSupported"
       :style="{width: percent + '%'}"
       :title="'Heap size: ' + formattedSize + (showHint ? '\n' + hint : '')"
       @mousedown="onMousedown"
  >
    <div class="visible"
        :class="{over100}"
    ></div>
    <div class="invisible"></div>
  </div>
</template>

<script setup>
import {bytesToSizeWinLike} from "../util.js";
import {computed, ref, onMounted, onBeforeUnmount} from "vue";


/** @type {import("vue").Ref<{jsHeapSizeLimit: number, totalJSHeapSize: number, usedJSHeapSize: number}>} */
const memory = ref(performance.memory);
const jsHeapSizeLimit = computed(() => memory.value.jsHeapSizeLimit);
const totalJSHeapSize = computed(() => memory.value.totalJSHeapSize);
const usedJSHeapSize  = computed(() => memory.value.usedJSHeapSize);

const intervalId = ref(null);
const over100 = ref(false);
const showHint = ref(false);
const hint = "Use middle mouse button click to clear the console.";

const percent = computed(() => {
  const percent = totalJSHeapSize.value / (jsHeapSizeLimit.value / 100);
  over100.value = percent > 100;
  return over100.value ? 100 : percent;
});

const formattedSize = computed(() => bytesToSizeWinLike(totalJSHeapSize.value));
const isSupported = computed(() => memory.value);

onMounted(() => {
  if (!isSupported.value) {
    return;
  }
  intervalId.value = setInterval(() => {
    memory.value = performance.memory;
  }, 1000);
});
onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});

/** @param {MouseEvent} event */
function onMousedown(event) {
  const LEFT_BUTTON = 0;
  const MIDDLE_BUTTON = 1;
  const RIGHT_BUTTON = 2;
  if (event.button === LEFT_BUTTON) {
    showHint.value = true;
  }
  if (event.button === MIDDLE_BUTTON) {
    event.preventDefault();
    showHint.value = false;
    console.clear();
  }
}
</script>

<style lang="scss" scoped>
.memory-consuming-component {
  position: absolute;
  left: 0;
  top: 0;
  > div {
    width: 100%;
  }
  .visible {
    background-color: #415aff;
    height: 2px;
    &:active {
      background-color: #415aff80;
    }
    &.over100 {
      background-color: #e30000;
    }
  }
  .invisible {
    height: 3px;
  }
}
</style>
