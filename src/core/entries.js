import {computed, ref} from "vue";
import {search, searchResult} from "./search.js";
import {openedFolder} from "./folders.js";


export const sort = ref(true);

const {compare} = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "accent",
});
export function comparator(pre, cur) {
    if (sort.value) {
        return compare(pre.name, cur.name);
    }
    return 0;
}

export const folders = computed(() => openedFolder.value.folders);
export const files = computed(() => openedFolder.value.files);
export const symlinks = computed(() => openedFolder.value.symlinks);
export const fifos = computed(() => openedFolder.value.fifos);
export const charDevs = computed(() => openedFolder.value.charDevs);
export const blockDevs = computed(() => openedFolder.value.blockDevs);
export const sockets = computed(() => openedFolder.value.sockets);
export const entries = computed(() => [
    ...folders.value.sort(comparator),
    ...files.value.sort(comparator),
    ...symlinks.value.sort(comparator),
    ...fifos.value.sort(comparator),
    ...charDevs.value.sort(comparator),
    ...blockDevs.value.sort(comparator),
    ...sockets.value.sort(comparator),
]);


/** @type {number} */
const limit = 1000;

/** @type {import("vue").ComputedRef<SimpleEntry[]>} */
export const list = computed(() => {
    if (search.value.length) {
        return searchResult.value;
    }
    return entries.value;
});
/** @type {import("vue").ComputedRef<SimpleEntry[]>} */
export const listLimited = computed(() => {
    return list.value.slice(0, limit);
});
/** @type {import("vue").ComputedRef<Number>} */
export const count = computed(() => {
    if (searchResult.value.length > limit) {
        return searchResult.value.length;
    }
    return list.value.length;
});
