<template>
  <div class="guide">
    <div class="text-wrapper">
      <h2>No scan selected</h2>
      <div>Use your own directory scan file (created with
        <a href="https://github.com/AlttiRi/keep-lister#how-to-use" target="_blank">the scanner</a>).
      </div>
      <div class="">Or use the demo scans to take a look at the program's work <span class="gray">(just click on the link)</span>:
        <ul>
          <li><a href="./?filepath=https://alttiri.github.io/json-flat-scans/windows-admin.json.gz">Win 10 scan (as Admin)</a></li>
          <li><a href="./?filepath=https://alttiri.github.io/json-flat-scans/ubuntu-admin.json.gz">Ubuntu scan (as Root)</a></li>
          <li><a href="./?filepath=https://alttiri.github.io/json-flat-scans/linux-master.json.gz">Linux Source Code scan</a></li>
        </ul>
      </div>
      <div class="gray">Also it supports mega.nz folder links (https://mega.nz/folder/ABcd12#XXX).<br>
        Just paste them in the search field.</div>
      <div>For more info see the <a href="https://github.com/AlttiRi/keep-lister#keeplister" target="_blank">Readme</a>.</div>
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
  padding: 15px;
  .text-wrapper {
    min-width: 50%;
  }
  div {
    margin-top: 15px;
  }
  .gray {
    color: #666666;
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
