<template>
  <div class="debug">
    <span v-if="debugMessage">{{debugMessage}}</span>
    <span v-else>_</span>
  </div>
</template>

<script setup>
import {debugMessage} from "../core/debug.js";
</script>

<style scoped>
.debug {
  padding: 2px 2px 2px 6px;
}
</style>
