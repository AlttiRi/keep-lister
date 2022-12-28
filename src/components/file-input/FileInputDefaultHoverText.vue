<template>
  <div class="default-hover-text">{{text}}</div>
</template>

<script setup>
import {computed} from "vue";
import {dropHoverItemCount} from "./file-input-state-private.js";
const text = computed(() => {
  const postfix = dropHoverItemCount.value > 1 ? "s" : "";
  return `Drop ${dropHoverItemCount.value} file${postfix}`;
});
</script>

<style scoped>
.default-hover-text {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
