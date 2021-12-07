<template>
  <div class="guide">
    <div class="text-wrapper">
      <h2>No scan selected</h2>
      <div>Use you own directory scan file (created with
        <a href="https://github.com/AlttiRi/directory-snapshot-explorer#how-to-use" target="_blank">the scanner</a>).
      </div>
      <div class="">Or use the demo scans to take a look at the program work:
        <ul>
          <li><a href="./?filepath=https://alttiri.github.io/json-flat-scans/windows-admin.json.gz">Win 10 scan (as Admin)</a></li>
          <li><a href="./?filepath=https://alttiri.github.io/json-flat-scans/ubuntu-admin.json.gz">Ubuntu scan (as Root)</a></li>
          <li><a href="./?filepath=https://alttiri.github.io/json-flat-scans/linux-master.json.gz">Linux Source Code scan</a></li>
        </ul>
      </div>
      <div>For more info see the <a href="https://github.com/AlttiRi/directory-snapshot-explorer#directory-snapshot-explorer" target="_blank">Readme</a>.</div>
    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.guide {
  animation: appear 2s;
  display: flex;
  justify-content: center;
  align-items: center;
  .text-wrapper {
    min-width: 50%;
  }
  div {
    margin-top: 15px;
  }
}

.text-wrapper {
  animation: fadein 1.5s linear 1 forwards;
}
@keyframes fadein {
  0% { opacity: 0; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
