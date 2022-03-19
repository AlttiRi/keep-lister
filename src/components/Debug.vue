<template>
  <div class="debug">
    <span>{{debugMessage}}</span>
  </div>
</template>

<script setup>
import {debugMessage} from "../core/debug.js";
</script>

<style scoped>
.debug {
  padding: 2px 2px 2px 6px;
  min-height: 18px;
}
</style>
