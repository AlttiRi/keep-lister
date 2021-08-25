<template>
<div class="address">
  <AddressBar_Base/>
  <AddressBar_Folder
      v-for="(folder, i) of openedFolders"
      :entry="folder"
      :index="i"
      :count="openedFolders.length"
  />
</div>
</template>

<script setup>
import AddressBar_Base from "./AddressBar_Base.vue";
import AddressBar_Folder from "./AddressBar_Folder.vue";
import {openedFolders} from "../store.js";
</script>

<style scoped>
.address {
  display: flex;
  align-items: center;
  white-space: pre; /* to display tailing spaces */
  overflow-x: scroll;
  padding-left: 6px;
}

::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}
</style>
