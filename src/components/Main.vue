<template>
  <div class="main">
    <div        style="grid-area: switch;"></div>
    <AddressBar style="grid-area: address;"/>
    <Search     style="grid-area: search;"/>
    <Tabs       style="grid-area: tabs;"/>
    <Content    style="grid-area: content;"/>
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
import Debug from "./Debug.vue";
import {onMounted} from "vue";
import {setJson} from "../core/folders.js";
import {appendScript} from "../util.js";


// Already opened directory, no need to open with input
onMounted(async () => {
  //todo search
  const filepath = new URL(location.href).searchParams.get("filepath");
  if (filepath) {
    const response = await fetch(filepath);
    /** @type {Object[]} */
    let data;

    // If "content-type" is "application/json" or "application/json; charset=utf-8"
    // and "content-encoding" is "gzip"
    // the browser will unGZip it itself.
    const contentType = response.headers.get("content-type");
    const contentEncoding = response.headers.get("content-encoding");
    if (contentType.startsWith("application/gzip")/* && contentEncoding === null*/) {
      const src = "https://cdn.jsdelivr.net/npm/pako@2.0.4/dist/pako_inflate.min.js";
      const integrity = "sha256-ZIKs3+RZEULSy0dR6c/mke8V9unZm9vuh05TqvtMdGU=";
      await appendScript(src, integrity);
      console.log("pako is loaded");

      const inflator = new pako.Inflate();
      const ab = await response.arrayBuffer();
      inflator.push(ab);
      if (inflator.err) {
        console.error(inflator.msg);
      }
      data = JSON.parse(new TextDecoder().decode(inflator.result));
    } else {
      data = await response.json();
    }

    setJson(data);
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
