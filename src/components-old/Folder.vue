<template>
  <div class="grid-row">
    <span class="icon">📁</span>
    <span class="folder"
          @click="onClick"
    >
      {{folder.name}}
    </span>
  </div>
</template>

<script>
import {toRefs} from "vue";
import {
  openFolder,
} from "../store.js";

export default {
  name: "Folder",
  props: ["folder"],
  setup(props) {
    const {folder} = toRefs(props);

    function onClick(event) {
      console.log(folder.value.name);
      openFolder(folder.value.name)
    }
    return {folder, onClick};
  }
}
</script>

<style scoped>
.grid-row {
  display: contents;
}

.icon {
  user-select: none;
  display: inline-block;
  /*width: 22px;*/
  /*margin-right: 4px;*/
}
</style>