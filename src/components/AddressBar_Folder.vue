<template>
  <span class="opened-folder"
        @click="onClick"
  >{{entry.name}}</span>{{isLast ? "" : separator}}
</template>

<script>
import {computed, toRefs} from "vue";

export default {
  props: ["entry", "separator", "count", "index"],
  name: "AddressBar_Folder",
  setup(props) {
    const {index, count, entry} = toRefs(props);
    const isLast = computed(() => {
      return index.value + 1 === count.value;
    });

    function onClick() {
      console.log("folder", entry.value);
    }

    return {
      isLast,
      onClick
    };
  }
}
</script>

<style lang="scss" scoped>

.opened-folder {
  border: 1px solid transparent;
  &:hover {
     border: 1px solid #8ca0ff;
   }
}
</style>
