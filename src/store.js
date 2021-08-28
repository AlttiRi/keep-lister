import {ref, computed, reactive, watch, toRaw, isReactive, unref} from "vue";
import {compare, dateToDayDateString, debounce, sleep} from "./util.js";


export const debugMessages = reactive([""]);

const json = ref(null);
const meta = ref(null);
export function setJson(object) {
    console.time("parseEntries");
    console.log(globalThis.json = parseEntries(object));
    console.timeEnd("parseEntries");
    json.value = globalThis.json;
    meta.value = object.meta;
    openFolder(json.value);
}


class SimpleEntry {
    //[Symbol.toStringTag] = "SimpleEntry";
    constructor({name, parent, type, meta, errors}) {
        Object.assign(this, {name, parent, type});
        if (meta) {
            Object.assign(this, {meta});
        }
        if (errors) {
            Object.assign(this, {errors});
        }
    }
    addChild(entry) {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(entry);
    }
    get folders() {
        return this.children?.filter(e => e.type === "folder");
    }
    get files() {
        return this.children?.filter(e => e.type === "file");
    }
    get symlinks() {
        return this.children?.filter(e => e.type === "symlink");
    }

    get fifos() {
        return this.children?.filter(e => e.type === "fifo");
    }
    get charDevs() {
        return this.children?.filter(e => e.type === "charDev");
    }
    get blockDevs() {
        return this.children?.filter(e => e.type === "blockDev");
    }
    get sockets() {
        return this.children?.filter(e => e.type === "socket");
    }

    get isEmpty() {
        return !Boolean(this.children?.length);
    }
    get hasErrors() {
        return Boolean(this.errors?.length);
    }
    /** @return {SimpleEntry} */
    get root() {
        if (!this.parent) {
            return this;
        }
        return this.parent.root;
    }
    /** @return {SimpleEntry[]} */
    get path() {
        if (!this.parent) {
            return [this];
        }
        return [...this.parent.path, this];
    }
}

function parseEntries(rootFolder, parent = null) {
    const root = new SimpleEntry({
        name: rootFolder.name,
        type: "folder",
        errors: rootFolder.errors,
        parent
    });
    if (rootFolder.folders) {
        rootFolder.folders.forEach(folder => {
            root.addChild(parseEntries(folder, root));
        });
    }
    const simpleTypes = ["file", "fifo", "charDev", "blockDev", "socket"];
    simpleTypes.forEach(type => {
        if (rootFolder[type+"s"]) {
            rootFolder[type+"s"].forEach(file => {
                root.addChild(new SimpleEntry({
                    name: file,
                    parent: root,
                    type: type
                }));
            });
        }
    });
    if (rootFolder.symlinks) {
        rootFolder.symlinks.forEach(symlink => {
            const meta = symlink.pathTo ? {
                pathTo: symlink.pathTo
            } : null;
            root.addChild(new SimpleEntry({
                name: symlink.name,
                parent: root,
                type: "symlink",
                meta,
                errors: symlink.errors
            }));
        });
    }
    return root;
}

/** @type {import("vue").ComputedRef<string>} */
export const separator = computed(() => {
    return meta.value?.separator || "/";
});
/** @type {import("vue").ComputedRef<string[]>} */
export const scanRootPath = computed(() => {
    return meta.value?.path || [];
});
/** @type {import("vue").Ref<SimpleEntry>} */
export const openedFolder = ref(new SimpleEntry({
    name: "",
}));
/** @type {import("vue").ComputedRef<SimpleEntry[]>} */
export const openedFolders = computed(() => {
    console.log("path", openedFolder.value);
    return openedFolder.value.path;
});
watch(json, async (newValue, oldValue) => {
    search.value = "";
    console.log(meta.value);
    const {files, folders, symlinks, errors, total, scanDate} = meta.value;
    if (meta.value.scanDate) {
        debugMessages[0] =
            `files: "${files}" folders: "${folders}", symlinks: "${symlinks}", ` +
            `errors: "${errors}", total: "${total}", scanDate: "${dateToDayDateString(scanDate)}"`;
    }
});

/** @param {SimpleEntry} entry */
export function openFolder(entry) {
    search.value = "";
    openedFolder.value = entry;
}
export function back() {
    if (openedFolder.value.parent) {
        openFolder(openedFolder.value.parent);
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
export const fifos = computed(() => openedFolder.value.fifos || []);
export const charDevs = computed(() => openedFolder.value.charDevs || []);
export const blockDevs = computed(() => openedFolder.value.blockDevs || []);
export const sockets = computed(() => openedFolder.value.sockets || []);
export const entries = computed(() => [
    ...folders.value.sort(comparator),
    ...files.value.sort(comparator),
    ...symlinks.value.sort(comparator),
    ...fifos.value.sort(comparator),
    ...charDevs.value.sort(comparator),
    ...blockDevs.value.sort(comparator),
    ...sockets.value.sort(comparator),
]);

export const empty = computed(() => json.value && openedFolder.value.isEmpty);

/** @type {number} */
const limit = 1000;
/** @type {import("vue").Ref<string>} */
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
    return list.value.length;
});

//todo search by type
// /type:folder/
//todo check linked list perf for large search
const performSearchDebounced = debounce(performSearch, 300);
async function performSearch() {
    let message = "";
    const folder = openedFolder.value;

    const time1 = performance.now();
    const result = await justFind(folder, search.value);
    const searchTime = performance.now() - time1;
    message += `Search time: ${searchTime.toFixed(2)} ms; `;
    debugMessages[0] = message;
    await sleep();

    const time2 = performance.now();
    const sortedResult = result.sort(comparator);
    const sortTime = performance.now() - time2;
    message += `Sort time: ${sortTime.toFixed(2)} ms; `;
    debugMessages[0] = message;
    await sleep();

    searchResult.value = sortedResult;
    message += `${searchResult.value.length} items; search: ${search.value}`;
    debugMessages[0] = message;
}
watch(search, async (newValue, oldValue) => {
    if (!newValue) {
        searchResult.value = [];
        return;
    }
    // "no debounce by paste event"
    if (newValue.length - oldValue.length > 1) {
        await performSearch();
    } else {
        performSearchDebounced();
    }
});

/**
 * @param {SimpleEntry} folder
 * @param {String} word
 * @return {Promise<SimpleEntry[]>}
 */
async function justFind(folder, word) {
    let time = performance.now();

    // Do unProxy.
    // Up to x40 in comparison with default reactive ref.
    const folderRaw = isReactive(folder) ? toRaw(folder) : folder;


    /** @type SimpleEntry[] */
    const result = [];

    const types = ["file", "symlink", "fifo", "charDev", "blockDev", "socket"];
    async function find(folder, word) {
        if (performance.now() - time > 16) {
            await sleep();
            time = performance.now();
        }
        for (const curFolder of (folder.folders || [])) {
            if (curFolder.name.includes(word)) {
                result.push(curFolder);
            }
            await find(curFolder, word);
        }
        for (const type of types) {
            for (const file of (folder[type + "s"] || [])) {
                if (file.name.includes(word)) {
                    result.push(file);
                }
            }
        }
    }
    await find(folderRaw, word);
    return result;
}
