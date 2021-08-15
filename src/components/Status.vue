<template>
  <div>Item count: {{count}}</div>
</template>

<script>
import {count} from "../store.js";

export default {
  name: "Status",
  setup() {
    return {count};
  }
}
</script>

<style scoped>

</style>
