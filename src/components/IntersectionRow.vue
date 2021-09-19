<template>
<div class="intersection" ref="intersection"></div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import {count, limit} from "../core/entries.js";

/** @param {IntersectionObserverEntry[]} entries */
const callback = (entries) => {
  const [entry] = entries;
  if (entry.isIntersecting) {
    if (count.value > limit.value) {
      limit.value = limit.value + 50;
    }
  }
}
const observer = new IntersectionObserver(callback);

/** @type {import("vue").Ref<HTMLElement>} */
const intersection = ref(null);

onMounted(() => {
  observer.observe(intersection.value);
});
onBeforeUnmount(() => {
  observer.disconnect();
});
</script>

<style scoped>
.intersection {
  width: 100%;
  position: relative;
  bottom: 120px;
}
</style>
