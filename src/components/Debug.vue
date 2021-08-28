<template>
  <span v-if="debugMessage">{{debugMessage}}</span>
  <span v-else>_</span>
</template>

<script setup>
import {debugMessage} from "../core/debug.js";
</script>

<style scoped>

</style>
