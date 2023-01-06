<template>
  <div class="default-prompt-text" :title="names">
    <div class="parsing" v-if="parsing">Parsing...</div>
    <div v-else-if="count">{{count}} file{{count > 1 ? "s" : ""}}</div>
    <div v-else style="display: contents">
      <slot>Select file</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from "vue";
import {FileInputState} from "./file-input-state";

const props = defineProps<{state: FileInputState}>();
const {
  count, fileEntries, parsing
} = props.state.private;

const names = computed(() => {
  /** @type {WebFileEntry[]} */
  const entries = fileEntries.value;
  return entries.slice(0, 50).map(file => file.name).join("\n");
});
</script>

<style lang="scss" scoped>
.default-prompt-text {
  width: inherit;
  height: inherit;
  max-width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  cursor: pointer;

  &:hover {
    //text-decoration: underline;
  }
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
