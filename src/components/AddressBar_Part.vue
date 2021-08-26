<template>
  <div class="box">
    <div class="sub" :style="{maxWidth}">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
/*import {toRefs} from "vue";*/
/*const props = */
defineProps({
  maxWidth: {
    default: "max-content",
    type: String,
  }
});
/*const {maxWidth} = toRefs(props);*/
</script>

<style lang="scss" scoped>
.box {
  height: 100%;
  .sub {
    height: 100%;
    overflow-x: hidden;
    text-overflow: ellipsis;
  }
}
</style>

