import {computed, watch, shallowRef, triggerRef, shallowReadonly, ref, readonly} from "vue";
import {clearSearch} from "./search.js";
import {folderDummy, SimpleBucketEntry, SimpleEntry} from "./entry.js";
import {dateToDayDateString, sleep} from "../util.js";
import {addMessage} from "./debug.js";
import {parseScan} from "./scan-parser.js";
import {limit} from "./entries.js";
import {scanParsing, scanParsingProgress} from "./state.js";


/**
 * @typedef {Object} SpecialMeta
 * @property {Object} [special]
 */
/**
 * @typedef {ScanMeta & SpecialMeta} FolderMeta
 */
// Well, IDEA does not support `{ScanMeta & SpecialMeta}` correctly
// todo make a class for it

/** @type {import("vue").ShallowRef<FolderMeta|null>} */
const rootMeta  = shallowRef(null);
/** @type {import("vue").ShallowRef<SimpleEntry>} */
const root      = shallowRef(null);

const _rootMeta = shallowReadonly(rootMeta);
const _root     = shallowReadonly(root);
export {_rootMeta as rootMeta, _root as root};

/** @type {import("vue").ShallowRef<SimpleBucketEntry>} */
const home = shallowRef(new SimpleBucketEntry());
globalThis.home = home.value;
const isHomeOpened = ref(false);
export function clearHome() {
    console.log("clearHome");
    home.value.children = [];
    triggerRef(openedFolder);
    reset();
}

const _home = shallowReadonly(home);
const _isHomeOpened = readonly(isHomeOpened);
export {_home as home, _isHomeOpened as isHomeOpened};

function updateParsingState() {
    triggerRef(openedFolder);
}

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
        if (!rootInited && rootEntry) {
            if (!metaInited && scanMeta) {
                rootEntry.meta = scanMeta;
                metaInited = true;
                total = scanMeta.total;
                processedTotal -= 1;
            }
            openFolder(rootEntry);
            rootInited = true;
        }
        const now = Date.now();
        if (rootContentUpdated || now - time > 50) {
            time = now;
            updateParsingState();
            await sleep();
        }
    }
    updateParsingState();
    console.log(`[setScan][time]:`, Date.now() - startTime, "ms");

    scanParsing.value = false;
    return true;
}

/** @type {import("vue").ComputedRef<string>} */
export const separator = computed(() => {
    return rootMeta.value?.separator || "/";
});
/** @type {import("vue").ComputedRef<string[]>} */
export const scanRootPath = computed(() => {
    return rootMeta.value?.path || [];
});


/** @type {import("vue").ShallowRef<SimpleEntry>} */
export const openedFolder = shallowRef(folderDummy);
/** @type {import("vue").ComputedRef<SimpleEntry[]>} */
export const openedFolders = computed(() => {
    return openedFolder.value.path;
});

function reset() {
    clearSearch();
    openFolder(folderDummy);
    root.value = null;
    rootMeta.value = null;
    globalThis.root = null;
    globalThis.folder = null;
}

/** @param {SimpleEntry} entry */
export function openFolder(entry) {
    clearSearch();
    openedFolder.value = entry;
    limit.value = 50;

    const root = entry.root;
    globalThis.root = root;
    root.value = root;
    rootMeta.value = root.meta || {};

    if (entry !== home.value) {
        if (!home.value.children?.includes(root)) {
            home.value.addChild(root);
        }
    }
    isHomeOpened.value = entry === home.value;

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


watch(rootMeta, async (newValue, oldValue) => {
    console.log("[meta]:", rootMeta.value);
    if (!rootMeta.value) {
        return;
    }
    const {files, folders, symlinks, errors, total, scanDate} = rootMeta.value;
    if (rootMeta.value.scanDate) {
        addMessage(
            `files: "${files}" folders: "${folders}", symlinks: "${symlinks}", ` +
            `errors: "${errors}", total: "${total}", scanDate: "${dateToDayDateString(scanDate)}"`
        );
    }
});
