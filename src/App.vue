<template>
  <Main/>
</template>

<script setup>
import Main from "./components/Main.vue";
</script>

<style>
:root {
  --blue-1: #8CA0FF;
  --blue-2: #E6F4FF;
  --blue-3: #E6EEFF;
  --blue-4: #F5FAFF;
  --white:  #FFF;
  --gray-1: #EEE;
  --gray-2: #D4D4D4;
  --red-1:  #EA214A;
}

/* Default component colors. Do not change. */
:root {
  --drop-hover: rgba(0,0,0,0.03);
  --drop-active: rgba(0,0,0,0.06);
  --drop-file-hover: rgba(0,0,0,0.06);
  --file-input-border: rgba(0,0,0,0.6);
}

:root {
  --file-input-border: var(--gray-2);
}
</style>
