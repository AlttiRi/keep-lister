<template>
  <div class="main">
    <div>
      <div class="file-select">
        <input type="file" accept="application/json" @change="onChange">
        <hr>
      </div>

      <div>
        <input type="text" v-model="search">
        <button>Search</button>
      </div>

      <div>
        <hr>
        <div v-for="searchRow of searchResultLimited">
          <div>{{searchRow}}</div>
        </div>
        <hr>
      </div>
      <div>
        <div>{{scanFolder}}{{openFolders}}</div>
      </div>
    </div>



    <div
        @contextmenu="onContextMenu"
    >
      <div class="grid-container"
           v-if="!empty"
      >
        <div class="grid">
          <Folder v-for="folder of folders" :folder="folder"></Folder>
          <File v-for="file of files" :file="file"></File>
          <SymLink v-for="symlink of symlinks" :symlink="symlink"></SymLink>
        </div>
      </div>
      <div v-else>
        ...no files
      </div>
    </div>


  </div>
</template>

<script setup>
import Folder from "./Folder.vue";
import File from "./File.vue";
import SymLink from "./SymLink.vue";
import {ref, computed, reactive, watch, onMounted} from "vue";
import {
  folders,
  files,
  symlinks,
  back,
  setJson,
  scanFolder,
  openFolders,
  json
} from "../store.js";
import {sleep} from "../util.js";

onMounted(async () => {
  setJson(await fetch("./data/[2021.07.02].json").then(r => r.json()))
});



const search = ref("");
const searchResult = ref([""]);
const searchResultLimited = computed(() => {
  return searchResult.value.slice(0, 100);
});





watch(search, async (oldV, newV) => {
  const time = performance.now();
  // searchResult.value = await genToListNoBlocking(find(json.value, search.value));
  searchResult.value = await justFind(json.value, search.value);
  console.log(performance.now() - time, search.value);
  console.log(searchResult.value.length);
});

async function justFind(folder, word) {
  let time = performance.now();
  const result = [];

  async function find(folder, word) {
    if (performance.now() - time > 16) {
      await sleep();
      time = performance.now();
    }
    for (const _folder of (folder.folders || [])) {
      await find(_folder, word);
    }
    for (const file of (folder.files || [])) {
      if (file.includes(word)) {
        result.push(file);
      }
    }
    for (const symlink of (folder.symlinks || [])) {
      if (symlink.includes(word)) {
        result.push(symlink);
      }
    }
  }
  await find(folder, word);
  return result;
}

//---blocking on rare cases
// async function genToListNoBlocking(generator) {
//   const result = [];
//   let time = performance.now();
//   for await (const entry of generator) {
//     result.push(entry);
//     if (performance.now() - time > 16) {
//       await sleep();
//       time = performance.now();
//     }
//   }
//   return result;
// }
//
// function * find(folder, word) {
//   for (const _folder of (folder.folders || [])) {
//     yield * find(_folder, word);
//   }
//   for (const file of (folder.files || [])) {
//     if (file.includes(word)) {
//       yield file;
//     }
//   }
// }

//------slow
//
// watch(search, async (oldV, newV) => {
//   // searchResult.value = [...find(json.value, search.value)];
//   const time = performance.now();
//   searchResult.value = await findAll(keepFPS(yieldAll(json.value)), search.value);
//   console.log(performance.now() - time, search.value);
//   console.log(searchResult.value.length);
// });
//
// async function findAll(generator, text) {
//   const result = [];
//   for await (const entry of generator) {
//     if (entry.includes(text)) {
//       result.push(entry);
//     }
//   }
//   return result;
// }
//
// async function * keepFPS(generator, fps = 60) {
//   let time = performance.now();
//   for await (const entry of generator) {
//     if (performance.now() - time > 16) {
//       await sleep();
//       time = performance.now();
//     }
//     yield entry;
//   }
// }
//
// function * yieldAll(folder) {
//   for (const _folder of (folder.folders || [])) {
//     yield * yieldAll(_folder);
//   }
//   for (const file of (folder.files || [])) {
//     yield file;
//   }
// }
//------

async function onChange(event) {
  const jsonObj = JSON.parse(await event.target.files[0].text());
  setJson(jsonObj);
  globalThis.json = jsonObj;
}

function onContextMenu(event) {
  event.preventDefault();
  back();
}

const empty = computed(() => !(folders.value?.length || files.value?.length || symlinks.value?.length));

</script>

<style scoped>

.grid {
  display: grid;
  grid-template-columns: 0fr 1fr;
  grid-column-gap: 4px;
}
.grid-container {
  min-height: 100%;
  background-color: #f5f5f5;
  flex-grow: 1;
  overflow: auto;
  white-space: nowrap;
}
.main {
  display: contents;
  /*width: 1280px;*/
  /*display: flex;*/
  /*justify-content: start;*/
  /*align-items: center;*/
  /*flex-direction: column;*/
  /*min-height: 100%;*/
  /*width: 1280px;*/
}
.file-select {
/*margin-top: 40px;*/
}
</style>
