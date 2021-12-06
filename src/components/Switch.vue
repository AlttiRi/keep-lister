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

<style scoped>
.switch {
  display: flex;
  justify-content: center;
  align-items: center;
}
button {
  margin: 1px 3px;
}
button.active {
  font-weight: bold;
}
</style>
