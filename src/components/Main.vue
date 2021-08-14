<template>
  <div class="main">

    <div class="switch"></div>
    <Tabs/>

    <Address class="address"/>
    <Search/>
    <Content class="content"/>

  </div>
</template>

<script>
import Content from "./Content.vue";
import Address from "./Address.vue";
import Search from "./Search.vue";
import Tabs from "./Tabs.vue";

import {onMounted} from "vue";
import {setJson} from "../store.js";

const filename = "[2021.08.13].json";

export default {
  name: "Main",
  components: {
    Content,
    Address,
    Search,
    Tabs
  },
  setup(props) {
    onMounted(async () => {
      const url = "./test-data/" + filename;
      const response = await fetch(url);
      const data = await response.json();
      setJson(data);
    });
    return {};
  }
}
</script>

<style scoped>
.main {
  height: 720px;
  max-height: 100vh;

  display: grid;
  grid-template-columns: 7em 2fr 1fr;
  grid-template-rows:    2em 1fr;
  grid-template-areas: "switch address search "
                       "tabs   content content";
  width: 1280px;
  max-width: 100%;
}

.main > .switch {
  grid-area: switch;
  background-color: aquamarine;
}
.main > .tabs {
  grid-area: tabs;
  background-color: #8ca0ff;
}

.main > .address {
  grid-area: address;
  background-color: #ffa08c;
}

.main > .search {
  grid-area: search;
  background-color: #ffff64;
}

.main > .content {
  grid-area: content;
  background-color: #f5f5f5;
}
</style>
