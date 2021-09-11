import {computed, ref} from "vue";
import {search, searchResult} from "./search.js";
import {openedFolder, openedFolderStateNumber} from "./folders.js";


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

// grouped by type
export const entries = computed(() => {
    if (openedFolderStateNumber.value) {
        // force recomputing of change
    }
    return [
        ...openedFolder.value.folders.sort(comparator),
        ...openedFolder.value.files.sort(comparator),
        ...openedFolder.value.symlinks.sort(comparator),
        ...openedFolder.value.fifos.sort(comparator),
        ...openedFolder.value.charDevs.sort(comparator),
        ...openedFolder.value.blockDevs.sort(comparator),
        ...openedFolder.value.sockets.sort(comparator),
    ]
});


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
