<template>
  <div class="switch">
    <button
        class="order-by-name"
        title="Order by name"
        @click="onN"
        :class="{active: orderBy === 'name'}"
    >{{ orders.name  ? "N" : "n"}}</button>
    <button
        class="order-by-size"
        title="Order by size"
        @click="onS"
        :class="{active: orderBy === 'size'}"
    >{{ orders.size  ? "S" : "s"}}</button>
    <button
        class="order-by-date"
        title="Order by date"
        @click="onD"
        :class="{active: orderBy === 'mtime'}"
    >{{ orders.mtime ? "D" : "d"}}</button>
  </div>
</template>

<script setup>
import {orderBy, toggleOrder, orders} from "../core/entries.js";

// todo optimise reversing.
// todo cancel sorting (for large arrays) on new click while sorting

function onN() {
  if (orderBy.value === "name") {
    toggleOrder();
  }
  orderBy.value = "name";
}
function onS() {
  if (orderBy.value === "size") {
    toggleOrder();
  }
  orderBy.value = "size";
}
function onD() {
  if (orderBy.value === "mtime") {
    toggleOrder();
  }
  orderBy.value = "mtime";
}
</script>

<style lang="scss" scoped>
.switch {
  display: flex;
  justify-content: center;
  align-items: center;
}
button.active {
  font-weight: bold;
}

button {
  margin: 1px 3px;
  padding: 2px 6px;
  outline-width: 1px;
  outline-color: var(--blue-1);
  border: 1px solid var(--gray-2);
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
</style>
