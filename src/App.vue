<template>
  <Main/>
</template>

<script setup>
import Main from "./components/Main.vue";
</script>

<style>
:root {
  --blue-1: #8CA0FFFF;
  --blue-2: #F0F8FFFF;
  --blue-3: #E6EEFFFF;
  --blue-4: #F0F4FFD8;
  --white:  #FFF;
  --gray-1: #EEE;
  --gray-2: #D4D4D4FF;
  --red-1:  #EA214AE0;
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
