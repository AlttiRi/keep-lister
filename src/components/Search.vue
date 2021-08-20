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

<style lang="scss" scoped>
.search {
  display: flex;
  input {
    flex-grow: 2;
    border: none;
    padding-left: 6px;
    border-top: transparent solid 1px;
    border-bottom: transparent solid 1px;
    &:hover {
      border-bottom: var(--blue-2) solid 1px;
    }
    &:focus {
      outline: none;
      border-bottom: var(--blue-1) solid 1px;
    }
  }
  button, button:focus, button:active {
    outline: none;
    background: var(--blue-2);
  }
  button:hover {
    background: var(--blue-1);
  }
  button, button:focus {
    border: 1px solid transparent;
  }
  button:active {
    border: 1px solid var(--gray-1);
  }
}
</style>
