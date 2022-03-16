import {computed, markRaw, ref, watch, shallowRef} from "vue";
import {clearSearch} from "./search.js";
import {folderDummy} from "./entry.js";
import {dateToDayDateString, sleep} from "../util.js";
import {addMessage} from "./debug.js";
import {parseScan} from "./scan-parser.js";
import {limit} from "./entries.js";
import {scanParsing, scanParsingProgress} from "./state.js";


/** @type {import("vue").ShallowRef<ScanMeta>} */
export const meta = shallowRef(null);
/** @type {import("vue").ShallowRef<SimpleEntry>} */
const root = shallowRef(null);

// A hack to run recomputing of a computed property
export const parsingStateNumber = ref(0);

class ExecutionState {
    constructor() {
        this.abortRequested = false;
        this._promise = Promise.resolve();
        this._resolve = () => {};
    }
    abort() {
        this.abortRequested = true;
        return this._promise;
    }
    start() {
        this._promise = new Promise(r => this._resolve = r);
    }
    abortIfRequested() {
        if (!execution.abortRequested) {
            return false;
        }
        this.abortRequested = false;
        this._resolve();
        return true;
    }
}
const execution = new ExecutionState();
/**
 * @param {Blob|Response} input
 * @return {Promise<Boolean>}
 */
export async function setScan(input) {
    if (scanParsing.value) {
        await execution.abort();
    }
    scanParsingProgress.value = 0;
    scanParsing.value = true;
    execution.start();

    let metaInited = false;
    let rootInited = false;

    const startTime = Date.now();
    let time = Date.now();
    let processedTotal = 0;
    let total;
    for await (const {meta: scanMeta, root: rootEntry, rootUpdated: rootContentUpdated, processed} of parseScan(input)) {
        processedTotal += processed;
        if (total) {
            const percentStr = (processedTotal / total * 100).toPrecision(3);
            scanParsingProgress.value = Number(percentStr);
        }

        if (execution.abortIfRequested()) {
            console.log(`[setScan][time][aborted]`, Date.now() - startTime, "ms");
            return false;
        }
        if (!metaInited && scanMeta) {
            meta.value = markRaw(scanMeta);
            metaInited = true;
            total = scanMeta.total;
            processedTotal -= 1;
        }
        if (!rootInited && rootEntry) {
            root.value = markRaw(rootEntry);
            globalThis.root = rootEntry;
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
    console.log(`[setScan][time]:`, Date.now() - startTime, "ms");

    scanParsing.value = false;
    return true;
}

/** @type {import("vue").ComputedRef<string>} */
export const separator = computed(() => {
    return meta.value?.separator || "/";
});
/** @type {import("vue").ComputedRef<string[]>} */
export const scanRootPath = computed(() => {
    return meta.value?.path || [];
});


/** @type {import("vue").ShallowRef<SimpleEntry>} */
export const openedFolder = shallowRef(folderDummy);
/** @type {import("vue").ComputedRef<SimpleEntry[]>} */
export const openedFolders = computed(() => {
    return openedFolder.value.path;
});

/** @param {SimpleEntry} entry */
export function openFolder(entry) {
    clearSearch();
    openedFolder.value = entry;
    limit.value = 50;

    /** @type {SimpleEntry} */
    globalThis.folder = entry;
    console.log("globalThis.folder:", entry);
}
Object.defineProperty(globalThis, "flat", {
    get() {
        return globalThis.folder?.flat();
    }
});

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
