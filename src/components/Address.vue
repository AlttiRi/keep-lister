<template>
<div class="address">
  {{scanPath}}{{openFolders}}
</div>
</template>

<script>
import {
  scanPath,
  openFolders,
} from "../store.js";
export default {
  name: "Address",
  setup() {
    return {
      scanPath,
      openFolders
    };
  }
}
</script>

<style scoped>
.address {
  display: flex;
  align-items: center;
  padding-left: 6px;
}
</style>
