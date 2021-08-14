<template>
  <div class="grid-row">
    <span class="icon">📄</span>
    <span class="file">
      {{file}}
    </span>
  </div>
</template>

<script>
import {toRefs} from "vue";
export default {
  name: "File",
  props: ["file"],
  setup(props) {
    // const {file} = toRefs(props);
    //
    // return {file};
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