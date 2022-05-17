<template>
<div class="address" @contextmenu="onContextmenu">
  <AddressBar_Part>
    <AddressBar_Base/>
  </AddressBar_Part>
  <AddressBar_Part
      v-for="(folder, i) of openedFolders.slice(1)"
  >
    <AddressBar_Folder
        :entry="folder"
        :index="i"
        :count="openedFolders.slice(1).length"
    />
  </AddressBar_Part>
</div>
</template>

<script setup>
import AddressBar_Base from "./AddressBar_Base.vue";
import AddressBar_Folder from "./AddressBar_Folder.vue";
import AddressBar_Part from "./AddressBar_Part.vue";
import {rootMeta, openedFolder, openedFolders, separator} from "../core/folders.js";

/** @param {MouseEvent} event */
async function onContextmenu(event) {
  event.preventDefault();
  const folderPath = [...rootMeta.value.path, ...openedFolder.value.path.map(entry => entry.name)].join(separator.value);
  console.log("Copy to clipboard:", folderPath);
  await navigator.clipboard.writeText(folderPath);
}
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
  &:active { // todo only on onContextmenu event do it
    border-right: var(--blue-1) solid 1px;
  }
}
</style>
