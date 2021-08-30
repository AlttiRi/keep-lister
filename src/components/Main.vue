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


// Already opened directory, no need to open with input
onMounted(async () => {
  const filepath = new URL(location.href).searchParams.get("filepath");
  if (filepath) {
    const response = await fetch(filepath);
    const data = await response.json();
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
