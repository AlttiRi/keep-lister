<template>
  <div class="content"
       @contextmenu="onContextMenu"
  >
    <table class="grid">
      <Row v-for="entry of listLimited" :entry="entry"/>
    </table>
  </div>
</template>

<script>
import Row from "./Row.vue";
import {
  back,
  list, listLimited
} from "../store.js";

export default {
  name: "Content",
  components: {
    Row,
  },
  setup(props) {
    function onContextMenu(event) {
      event.preventDefault();
      back();
    }
    return {onContextMenu, listLimited, list};
  }
}


</script>

<style scoped>
.content, table {
  width: 100%;
  overflow: auto;
}
</style>
