<template>
  <Main/>
</template>

<script setup>
import Main from "./components/Main.vue";
</script>

<style>
:root {
  --blue-1: #8ca0ff;
  --blue-2: aliceblue;
  --blue-3: #e6eeff;
  --white:  white;
  --gray-1: #eee;
  --gray-2: #d4d4d4;
  --red-1: rgba(234, 33, 74, 0.88);
}

:root {
  --drop-hover: rgba(0,0,0,0.03);
  --drop-active: rgba(0,0,0,0.06);
  --drop-file-hover: rgba(0,0,0,0.06);
  --file-input-border: rgba(0,0,0,0.6);
}
</style>
