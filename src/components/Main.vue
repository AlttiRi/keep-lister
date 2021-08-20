<template>
  <div class="main">
    <div        style="grid-area: switch;"></div>
    <Tabs       style="grid-area: tabs;"/>
    <AddressBar style="grid-area: address;"/>
    <Search     style="grid-area: search;"/>
    <Content    style="grid-area: content;"/>
    <Status     style="grid-area: status;"/>
    <Debug      style="grid-area: debug;"/>
  </div>
</template>
<script setup>
import Content from "./Content.vue";
import AddressBar from "./AddressBar.vue";
import Search from "./Search.vue";
import Tabs from "./Tabs.vue";
import Status from "./Status.vue";
import Debug from "./Debug.vue";

import {localhostDebug} from "../localhost-debug.js";

localhostDebug();
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

  grid-gap: 1px;
  border: 1px solid #d4d4d4;
  background-color: white;
  & > * {
    background-color: inherit;
    border-right: inherit;
    margin-right: -1px;
    border-bottom: inherit;
    margin-bottom: -1px;
  }

  height: 720px;
  max-height: 100vh;
  width: 1280px;
  max-width: 100%;
}
</style>
