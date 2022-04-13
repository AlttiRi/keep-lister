<template>
  <div class="switch">
    <button
        class="order-by-name"
        title="Order by name"
        @click="onClick('name')"
        :class="{active: orderBy === 'name'}"
    >{{ orders.name  ? "N" : "n"}}</button>
    <button
        class="order-by-size"
        title="Order by size"
        @click="onClick('size')"
        :class="{active: orderBy === 'size'}"
    >{{ orders.size  ? "S" : "s"}}</button>
    <button
        class="order-by-time"
        :title="'Order by ' + selectedTime"
        @click="onClick('time')"
        @contextmenu.prevent="toggleTimeType"
        :class="{active: orderBy === 'time', [selectedTime]: true}"
    >{{ orders.time ? "D" : "d"}}</button>
  </div>
</template>

<script setup>
import {orderBy, toggleOrder, orders, selectedTime} from "../core/entries.js";

// todo optimise reversing.
// todo cancel sorting (for large arrays) on new click while sorting

function toggleTimeType() {
  selectedTime.value = selectedTime.value === "mtime" ? "btime" : "mtime";
}

/** @param {"name"|"size"|"time"} value */
function onClick(value) {
  if (orderBy.value === value) {
    toggleOrder();
  }
  orderBy.value = value;
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
.btime {
  font-style: italic;
}

button {
  width: 22px;
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
