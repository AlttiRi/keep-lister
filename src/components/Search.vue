<template>
  <div class="search">
    <input type="text" v-model="search">
    <button @click="clear">Clear</button>
  </div>
</template>

<script>
import {search} from "../store.js";
export default {
  name: "Search",
  setup() {
    function clear() {
      search.value = "";
    }
    return {search, clear};
  }
}
</script>

<style scoped>
.search {
  display: flex;
}
.search input {
  flex-grow: 2;
}
</style>
