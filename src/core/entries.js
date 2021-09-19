import {computed, ref} from "vue";
import {search, searchResult} from "./search.js";
import {openedFolder, parsingStateNumber} from "./folders.js";


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
    if (parsingStateNumber.value) {
        // force recomputing on change
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


/** @type {import("vue").Ref<Number>} */
export const limit = ref(50);

/** @type {import("vue").ComputedRef<SimpleEntry[]>} */
export const list = computed(() => {
    if (search.value.length) {
        return searchResult.value;
    }
    return entries.value;
});
/** @type {import("vue").ComputedRef<SimpleEntry[]>} */
export const listLimited = computed(() => {
    return list.value.slice(0, limit.value);
});
/** @type {import("vue").ComputedRef<Number>} */
export const count = computed(() => {
    if (searchResult.value.length > limit.value) {
        return searchResult.value.length;
    }
    return list.value.length;
});

/** @type {import("vue").Ref<SimpleEntry>} */
export const hoveredEntry = ref(null);
