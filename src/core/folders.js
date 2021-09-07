import {computed, markRaw, ref, unref, watch} from "vue";
import {clearSearch} from "./search.js";
import {folderDummy, parseFlatScan} from "./entry.js";
import {dateToDayDateString} from "../util.js";
import {addMessage} from "./debug.js";


/** @type {import("vue").Ref<ScanMeta>} */
export const meta = ref(null);
/** @type {import("vue").Ref<SimpleEntry>} */
const json = ref(null);
/**
 * @see FlatScanResult
 * @param {Object[]} flatScan */
export function setJson(flatScan) {
    /** @type {ScanMeta} */
    const scanMeta = flatScan[0];
    /** @type {SerializableScanEntry[]} */
    const sEntries = flatScan.slice(1);

    meta.value = markRaw(scanMeta);
    console.time("parseEntries");
    const result = parseFlatScan(sEntries);
    console.timeEnd("parseEntries");

    json.value = markRaw(result);
    globalThis.json = result;

    openFolder(result);
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
}
export function goBack() {
    if (openedFolder.value.parent) {
        openFolder(openedFolder.value.parent);
    }
}
/** @type {import("vue").ComputedRef<Boolean>} */
export const empty = computed(() => json.value && openedFolder.value.isEmpty);


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
