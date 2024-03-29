<template>
  <div class="main">
    <MemoryConsuming/>
    <ScanProgressBar/>
    <Switch     style="grid-area: switch;"/>
    <AddressBar style="grid-area: address;"/>
    <Search     style="grid-area: search;"/>
    <Tabs       style="grid-area: tabs;"/>
    <Guide      style="grid-area: content;" v-if="showGuide"/>
    <InnerModal style="grid-area: content;" v-else-if="scanParsing && searchAwaiting">
      [Search]: Scan parsing awaiting ({{currentScansNum}} of {{scansCount}})
    </InnerModal>
    <Content    style="grid-area: content;" v-else/>
    <Status     style="grid-area: status;"/>
    <Debug      style="grid-area: debug;"/>
    <a class="readme" title="Open Readme" href="https://github.com/AlttiRi/keep-lister#keeplister" target="_blank"><i>i</i></a>
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
import ScanProgressBar from "./ScanProgressBar.vue";
import {computed, onMounted} from "vue";
import {rootMeta, setScan} from "../core/folders.js";
import {search} from "../core/search.js";
import {bytesToSize, bytesToSizeWinLike} from "../util.js";
import {orderBy, toggleOrder} from "../core/entries.js";
import {handleMegaUrl} from "../core/mega-nz.js";
import {scanParsing, searchAwaiting, scansCount, currentScansNum} from "../core/state";

globalThis.bytesToSize = bytesToSize;
globalThis.bytesToSizeWinLike = bytesToSizeWinLike;


// some kind of hack, but okay // don't show if a file selected, or remote scan is loading
const showGuide = computed(() => rootMeta.value === undefined && !new URL(location.href).searchParams.get("filepath") || rootMeta.value === null);


// Already opened directory, no need to open with input
onMounted(async () => {
  const url = new URL(location.href);
  const filepath = url.searchParams.get("filepath");
  const sort = url.searchParams.get("sort") || url.searchParams.get("order");
  if (["name", "size", "time"].includes(sort)) {
    orderBy.value = sort;
    if (["true", "1"].includes(url.searchParams.get("desc"))) {
      toggleOrder();
    }
  }
  if (filepath) {
    /** @type {Response} */
    const response = await fetch(filepath);
    await setScan(response);
  }
  const hash = url.hash.slice(1);
  if (hash.startsWith("https://mega.nz/")) {
    await handleMegaUrl(hash);
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

  @media screen and (max-width: 720px) {
    grid-template-areas: "switch  search  search "
                         "address address address"
                         "content content content"
                         "status  status  status "
                         "debug   debug   debug  "
                         "tabs    tabs    tabs   ";
    grid-template-rows:  2em 2em 1fr;
  }

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
.readme {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 2px 8px;
  margin: 1px;
  color: darkgray;
  text-decoration: none;
}
</style>
