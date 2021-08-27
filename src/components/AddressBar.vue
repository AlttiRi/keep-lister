<template>
<div class="address">
  <AddressBar_Part>
    <AddressBar_Base/>
  </AddressBar_Part>
  <AddressBar_Part
      v-for="(folder, i) of openedFolders"
  >
    <AddressBar_Folder
        :entry="folder"
        :index="i"
        :count="openedFolders.length"
    />
  </AddressBar_Part>
</div>
</template>

<script setup>
import AddressBar_Base from "./AddressBar_Base.vue";
import AddressBar_Folder from "./AddressBar_Folder.vue";
import AddressBar_Part from "./AddressBar_Part.vue";
import {openedFolders} from "../store.js";
</script>

<style lang="scss" scoped>
.address {
  display: flex;
  overflow-x: scroll;
  padding-left: 6px;

  scrollbar-width: none; // firefox
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 0;
    height: 0;
    background: transparent;
    display: none;
  }
}
</style>
