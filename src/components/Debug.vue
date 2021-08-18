<template>
  <span>{{debugMessages}}</span>
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
