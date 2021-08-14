<template>
  <tr class="row"
       @click="onClick"
  >
      <td class="icon">{{icon}}</td>
      <td class="name">{{entry.name}}</td>
<!--      <td class="type">{{entry.type}}</td>-->
  </tr>
</template>

<script>
import {toRefs, computed} from "vue";
import {
  openFolder,
} from "../store.js";

export default {
  name: "Row",
  props: ["entry"],
  setup(props) {
    const {entry} = toRefs(props);
    const icon = computed(() => {
      if (entry.value.type === "folder") {
        return "📁";
      } else if (entry.value.type === "file") {
        return "📄";
      } else if (entry.value.type === "symlink") {
        return "🔗";
      }
    });

    function onClick(event) {
      if (entry.value.type === "folder") {
        console.log("openFolder");
        openFolder(entry.value.name);
      } else {
        console.log(entry.value);
      }
    }

    return {entry, icon, onClick};
  }
}
</script>

<style scoped>

tr {
  width: 100%;
}
td {
  max-width: 0;
}


.icon {
  width: 2.5%;
  min-width: 22px;
}
.name {
  width: 95%;
}
.type {
  width: 15%;
}

.row * {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
.icon, .type {
  user-select: none;
}
</style>
