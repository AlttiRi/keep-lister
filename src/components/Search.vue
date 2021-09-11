<template>
  <div class="search">
    <input id="search" type="text" v-model="search">
    <button @click="clearSearch">Clear</button>
  </div>
  <label for="search" class="fuck-off-lighthouse">.</label>
</template>

<script setup>
import {search, clearSearch} from "../core/search.js";
//todo focus on double shift
</script>

<style lang="scss" scoped>
/** reset */
input { padding: 0 0; }
button { padding: 0 0; }

.fuck-off-lighthouse {
  position: absolute;
  top:-1000px;
  left:-1000px;
}

.search {
  display: flex;
  height: 100%;
  label {
    display: contents;
  }
  input {
    height: 100%;
    flex-grow: 2;
    border: none;
    padding-left: 6px;
    border-bottom: transparent solid 1px;
    box-sizing: border-box;
    &:focus, &:hover {
      outline: none;
      border-bottom: var(--blue-1) solid 1px;
    }
  }
  button {
    height: 100%;
    padding: 0 6px;
    outline: none;
    border: none;
    border-bottom: transparent solid 1px;
    border-left: var(--gray-2) solid 1px;
    box-sizing: border-box;
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
