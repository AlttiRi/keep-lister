<template>
  <div class="memory-consuming-component"
      v-if="isSupported"
      :style="{width: percent + '%'}"
      :title="'Heap size: ' + formattedSize"
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


const intervalId = ref(null);
const over100 = ref(false);

/** @type {import("vue").Ref<{jsHeapSizeLimit: number, totalJSHeapSize: number, usedJSHeapSize: number}>} */
const memory = ref(performance.memory);
const jsHeapSizeLimit = computed(() => memory.value.jsHeapSizeLimit);
const totalJSHeapSize = computed(() => memory.value.totalJSHeapSize);
const usedJSHeapSize  = computed(() => memory.value.usedJSHeapSize);

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
    &.over100 {
      background-color: #e30000;
    }
  }
  .invisible {
    height: 3px;
  }
}
</style>
