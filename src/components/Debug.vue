<template>
  <span v-if="debugMessages[0]">{{debugMessages[0]}}</span>
  <span v-else>_</span>
</template>

<script setup>
import {debugMessages} from "../store.js";
</script>

<style scoped>

</style>
