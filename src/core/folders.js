import {computed, markRaw, ref, unref, watch, } from "vue";
import {clearSearch} from "./search.js";
import {folderDummy} from "./entry.js";
import {dateToDayDateString, sleep} from "../util.js";
import {addMessage} from "./debug.js";
import {parseScan} from "./scan-parser.js";
import {limit} from "./entries.js";


/** @type {import("vue").Ref<ScanMeta>} */
export const meta = ref(null);
/** @type {import("vue").Ref<SimpleEntry>} */
const root = ref(null);

// A hack to run recomputing of a computed property
export const parsingStateNumber = ref(0);

/**
 * @param {Blob|Response} input
 * @return {Promise<void>}
 */
export async function setScan(input) {
    let metaInited = false;
    let rootInited = false;

    console.time("setScan");
    let time = Date.now();
    for await (const {meta: scanMeta, root: rootEntry, rootUpdated: rootContentUpdated} of parseScan(input)) {
        if (!metaInited && scanMeta) {
            meta.value = markRaw(scanMeta);
            metaInited = true;
        }
        if (!rootInited && rootEntry) {
            root.value = markRaw(rootEntry);
            globalThis.json = rootEntry;
            openFolder(rootEntry);
            rootInited = true;
        }
        const now = Date.now();
        if (rootContentUpdated || now - time > 50) {
            time = now;
            parsingStateNumber.value++;
            await sleep();
        }
    }
    parsingStateNumber.value++;
    console.timeEnd("setScan");

    clearSearch();
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
export const openedFolder = ref(folderDummy);
/** @type {import("vue").ComputedRef<SimpleEntry[]>} */
export const openedFolders = computed(() => {
    return openedFolder.value.path;
});

/** @param {SimpleEntry} entry */
export function openFolder(entry) {
    clearSearch();
    openedFolder.value = markRaw(unref(entry));
    limit.value = 50;
}
export function goBack() {
    if (openedFolder.value.parent) {
        openFolder(openedFolder.value.parent);
    }
}
/** @type {import("vue").ComputedRef<Boolean>} */
export const empty = computed(() => root.value && openedFolder.value.isEmpty);


watch(meta, async (newValue, oldValue) => {
    console.log("[meta]:", meta.value);
    const {files, folders, symlinks, errors, total, scanDate} = meta.value;
    if (meta.value.scanDate) {
        addMessage(
            `files: "${files}" folders: "${folders}", symlinks: "${symlinks}", ` +
            `errors: "${errors}", total: "${total}", scanDate: "${dateToDayDateString(scanDate)}"`
        );
    }
});
