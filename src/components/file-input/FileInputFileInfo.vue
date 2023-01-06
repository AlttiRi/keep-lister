<template>
    <span class="file-info" v-if="file">
      <span class="file-name" :title="file.name">{{file.name}}</span>
      <span class="file-size" :title="file.size">{{bytesToSizeWinLike(file.size)}}</span>
      <span class="file-mtime" v-if="file.mtime">{{dateToDayDateTimeString(file.mtime, false)}}</span>
    </span>
</template>

<script setup lang="ts">
import {bytesToSizeWinLike, dateToDayDateTimeString} from "../../util.js";
import {FileInputState} from "./file-input-state";

const props = defineProps<{state: FileInputState}>();
const {
  file
} = props.state.private;
</script>

<style lang="scss" scoped>
.file-info {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100%;
  .select-prompt {
    align-self: center;
  }
  > * {
    padding: 4px 12px;
  }
  .file-name {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .file-mtime {
    opacity: 0.9;
  }
}
</style>
