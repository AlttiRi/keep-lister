<template>
  <div class="content"
       @contextmenu="onContextMenu"
  >
    <table class="rows" v-if="listLimited.length">
      <tbody>
        <Row v-for="entry of listLimited" :entry="entry"/>
      </tbody>
    </table>
    <div class="empty-message" v-if="empty && !error">
      <span>The folder is empty.</span>
    </div>
    <div class="error-message" v-if="error">
      <div>
        <h2>Error</h2>
        <table>
          <tr>
            <td>syscall</td>
            <td><pre>{{error.syscall}}</pre></td>
          </tr>
          <tr>
            <td>code</td>
            <td><pre>{{error.code}}</pre></td>
          </tr>
          <tr>
            <td>errno</td>
            <td><pre>{{error.errno}}</pre></td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import Row from "./Row.vue";
import {goBack, empty, openedFolder} from "../core/folders.js";
import {listLimited} from "../core/entries.js";
import {computed, onMounted, ref} from "vue";

/** @type {ComputedRef<ScanError>} */
const error = computed(() => {
  if (openedFolder.value.hasErrors) {
    return openedFolder.value.errors[0];
  }
  return false;
});

function onContextMenu(event) {
  event.preventDefault();
  goBack();
}

const nameElemWidth = ref("880px");
onMounted(() => {
  const w = document.body.offsetWidth;
  if (w < 1280) {
    let px = 880 - (1280 - w);
    px = px < 140 ? 140 : px;
    nameElemWidth.value = `${px}px`;
  }
});

</script>


<style lang="scss" scoped>
::v-deep(.row .name) {
  width: v-bind(nameElemWidth);
}

.content {
  width: 100%;
  overflow: auto;
  .rows {
    width: 100%;
    overflow: auto;
  }
  .empty-message {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--gray-2);
  }
  .error-message {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: var(--red-1);
    div {
      h2 {
        margin: 0;
        padding-bottom: 6px;
        padding-left: 2px;
      }
      pre {
        display: inline;
      }
      td {
        padding-right: 3px;
      }
    }
  }
}
</style>
