<template>
  <span v-if="debugMessages[0]">{{debugMessages[0]}}</span>
  <span v-else>_</span>
</template>

<script>
import {debugMessages} from "../store.js";
export default {
  name: "Debug",
  setup() {
    return {
      debugMessages
    }
  }
}
</script>

<style scoped>

</style>
