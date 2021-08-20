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
/** reset */
input { padding: 0 0; }
button { padding: 0 0; }

.search {
  display: flex;
  height: 100%;
  input {
    height: 100%;
    flex-grow: 2;
    border: none;
    padding-left: 6px;
    border-bottom: var(--gray-2) solid 1px;
    &:focus, &:hover {
      outline: none;
      border-bottom: var(--blue-1) solid 1px;
    }
  }
  button {
    box-sizing: content-box;
    height: 100%;
    padding: 0 6px;
    outline: none;
    border: none;
    border-bottom: var(--gray-2) solid 1px;
    border-left: var(--gray-2) solid 1px;
    background-color: var(--gray-1);
    &:hover {
      border-bottom: var(--blue-1) solid 1px;
      background: var(--blue-2);
    }
    &:active {
      background: var(--blue-3);
    }
  }
}
</style>
