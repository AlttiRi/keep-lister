import {ref, computed, reactive, watch} from "vue";
import {sleep} from "./util.js";

const dummy = {
    name: "",
    folders: [],
    files: [],
    symlinks: []
};

export const json = ref(dummy);
export const scanPath = ref("");

const selected = ref(json);
const queue = reactive([]);
export const openFolders = computed(() => {
    if (!selected.value.name) {
        return "";
    }
    return ["", ...queue.map(o => o.name), selected.value.name].join("\\");
});


export function setJson(value) {
    json.value = value;
    scanPath.value = value.path.join("\\");
}

export function openFolder(name) {
    queue.push(selected.value);
    selected.value = selected.value.folders.find(folder => folder.name === name);
}
export function back() {
    if (queue.length) {
        selected.value = queue.pop();
    }
}


export const folders = computed(() => selected.value.folders || []);
export const files = computed(() => selected.value.files || []);
export const symlinks = computed(() => selected.value.symlinks || []);
export const entries = computed(() => [
    ...folders.value.map(value => ({type: "folder", ...value})),
    ...files.value.map(value => ({type: "file", name: value})),
    ...symlinks.value.map(value => ({type: "symlink", name: value})),
]);

export const empty = computed(() => !(folders.value?.length || files.value?.length || symlinks.value?.length));

export const sortedEntries = computed(() => {
    return entries.value;
    // todo
    // return entries.value.sort((pre, cur) => {
    //
    //
    //     pre = pre.name;
    //     cur = cur.name;
    //
    //     if (pre < cur && pre.length < cur.length) {
    //         return 1
    //     }
    //     if (pre > cur && pre.length > cur.length) {
    //         return -1
    //     }
    //     return 0;
    // });
});

export const search = ref("");
export const searchResult = ref([""]);
export const searchResultLimited = computed(() => {
    return searchResult.value.slice(0, 1000);
});

export const list = computed(() => {
    if (search.value.length) {
        return searchResultLimited.value;
    }
    return entries.value;
});


watch(search, async (oldV, newV) => {
    const time = performance.now();
    searchResult.value = await justFind(json.value, search.value);
    console.log(performance.now() - time, search.value, searchResult.value.length);
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
