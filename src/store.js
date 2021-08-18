import {ref, computed, reactive, watch} from "vue";
import {compare, sleep} from "./util.js";

export const debugMessages = reactive([""]);
export const separator = "\\"; //todo store the path separator in json / or \

const json = ref(null);
export const scanRootPath = computed(() => {
    return json.value?.path || [];
});
export const scanFolder = computed(() => {
    return json.value || {
        name: "",
        folders: [],
        files: [],
        symlinks: [],
    };
});

export const openedFolders = reactive([]);
export const openedFolder = computed(() => {
    if (openedFolders.length) {
        return openedFolders[openedFolders.length - 1];
    }
    return scanFolder.value;
});


export function readJsonFile(object) {
    json.value = object;
}

export function openFolder(entry) {
    openedFolders.push(entry);
}
export function back() {
    if (openedFolders.length) {
        openedFolders.pop();
    }
}

export const sort = ref(true);
function comparator(pre, cur) {
    if (sort.value) {
        return compare(pre.name, cur.name);
    }
    return 0;
}

export const folders = computed(() => openedFolder.value.folders || []);
export const files = computed(() => openedFolder.value.files || []);
export const symlinks = computed(() => openedFolder.value.symlinks || []);
export const entries = computed(() => [
    ...folders.value.map(value => ({type: "folder", ...value})).sort(comparator),
    ...files.value.map(value => ({type: "file", name: value})).sort(comparator),
    ...symlinks.value.map(value => ({type: "symlink", name: value})).sort(comparator),
]);

export const empty = computed(() => !(folders.value?.length || files.value?.length || symlinks.value?.length));

const limit = 1000;
export const search = ref("");
export const searchResult = ref([]);

export const list = computed(() => {
    if (search.value.length) {
        return searchResult.value;
    }
    return entries.value;
});
export const listLimited = computed(() => {
    return list.value.slice(0, limit);
});

export const count = computed(() => {
    if (searchResult.value.length > limit) {
        return searchResult.value.length;
    }
    return list.value.length
});

watch(search, async (newValue, oldValue) => {
    if (!newValue) {
        searchResult.value = [];
        return;
    }
    console.log({newValue, oldValue});
    const time = performance.now();
    searchResult.value = (await justFind(json.value, newValue)).sort(comparator);
    const searchTime = performance.now() - time;
    console.log(searchTime, newValue, searchResult.value.length);
    debugMessages[0] = `Search time: ${searchTime.toFixed(2)} ms`;
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
            if (_folder.name.includes(word)) {
                result.push({type: "folder", name: _folder.name});
            }
            await find(_folder, word);
        }
        for (const file of (folder.files || [])) {
            if (file.includes(word)) {
                result.push({type: "file", name: file});
            }
        }
        for (const symlink of (folder.symlinks || [])) {
            if (symlink.includes(word)) {
                result.push({type: "symlink", name: symlink});
            }
        }
    }
    await find(folder, word);
    return result;
}
