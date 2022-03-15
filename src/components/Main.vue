<template>
  <div class="main">
    <MemoryConsuming/>
    <Switch     style="grid-area: switch;"/>
    <AddressBar style="grid-area: address;"/>
    <Search     style="grid-area: search;"/>
    <Tabs       style="grid-area: tabs;"/>
    <Guide      style="grid-area: content;" v-if="showGuide"/>
    <InnerModal style="grid-area: content;" v-else-if="scanParsing && searchAwaiting">
      [Search]: Scan parsing awaiting
    </InnerModal>
    <Content    style="grid-area: content;" v-else/>
    <Status     style="grid-area: status;"/>
    <Debug      style="grid-area: debug;"/>
  </div>
</template>

<script setup>
import AddressBar from "./AddressBar.vue";
import Search from "./Search.vue";
import Tabs from "./Tabs.vue";
import Content from "./Content.vue";
import Status from "./Status.vue";
import Switch from "./Switch.vue";
import Debug from "./Debug.vue";
import Guide from "./Guide.vue";
import InnerModal from "./InnerModal.vue";
import MemoryConsuming from "./MemoryConsuming.vue";
import {computed, onMounted} from "vue";
import {meta, setScan} from "../core/folders.js";
import {search} from "../core/search.js";
import {bytesToSize, bytesToSizeWinLike} from "../util.js";
import {scanParsing, searchAwaiting} from "../core/state.js";

globalThis.bytesToSize = bytesToSize;
globalThis.bytesToSizeWinLike = bytesToSizeWinLike;


// some kind of hack, but okay // don't show if a file selected, or remote scan is loading
const showGuide = computed(() => !meta.value && !new URL(location.href).searchParams.get("filepath"));


// Already opened directory, no need to open with input
onMounted(async () => {
  const url = new URL(location.href);
  const filepath = url.searchParams.get("filepath");
  if (filepath) {
    /** @type {Response} */
    const response = await fetch(filepath);
    await setScan(response);
  }
  const _search = url.searchParams.get("search");
  if (_search) {
    search.value = _search;
  }
});

</script>

<style lang="scss" scoped>
.main {
  grid-template-areas: "switch address search "
                       "tabs   content content"
                       "status status  status "
                       "debug  debug   debug  ";

  display: grid;
  grid-template-columns: 7em 2fr 1fr;
  grid-template-rows:    2em 1fr;

  height: 720px;
  max-height: 100vh;
  width: 1280px;
  max-width: 100%;
  box-sizing: border-box;

  grid-gap: 1px;
  border: 1px solid var(--gray-2);
  background-color: var(--gray-2);
  * {
    background-color: white;
  }
}
</style>
