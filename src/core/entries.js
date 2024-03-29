import {computed, ref} from "vue";
import {search, searchResult} from "./search.js";
import {openedFolder} from "./folders.js";


export const sort = ref(true);

/** @type {import("vue").Ref<("mtime"|"btime")>} */
export const selectedTime = ref("mtime");
/** @type {import("vue").Ref<("name"|"size"|"time")>} */
export const orderBy = ref("name");
export const orders = ref({
    name: false,
    size: false,
    time: false,
});
export const reverseOrder = computed(() => orders.value[orderBy.value]);
export function toggleOrder() {
    orders.value[orderBy.value] = !orders.value[orderBy.value];
}

// todo tag:COMPUTED_TIME
// export const computedFolderTime = ref(true);
// globalThis.computedFolderTime = computedFolderTime;

const {compare} = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "accent",
});

// // todo create the list variable (search result -> the list), (opened dir entries -> the list)
// export const reactiveComparator = computed(() => {
//     const k = reverseOrder.value ? -1 : 1;
//     if (sort.value) {
//         if (orderBy.value === "name") {
//             return (pre, cur) => compare(pre.name, cur.name) * k;
//         } else if (orderBy.value === "size") {
//             return (pre, cur) => (pre.size - cur.size) * k;
//         } else if (orderBy.value === "mtime") {
//             return (pre, cur) => (pre.mtime - cur.mtime) * k;
//         }
//     }
//     return (pre, cur) => 0;
// });

export function comparator(pre, cur) {
    const k = reverseOrder.value ? -1 : 1;
    if (sort.value) {
        if (orderBy.value === "name") {
            return compare(pre.name, cur.name) * k;
        } else if (orderBy.value === "size") {
            return (pre.size - cur.size) * k;
        } else if (orderBy.value === "time") {
            const timeName = selectedTime.value;
            return (pre[timeName] - cur[timeName]) * k;
        }
    }
    return 0;
}

// grouped by type
export const entries = computed(() => {
    return [
        ...openedFolder.value.folders.sort(comparator),
        ...openedFolder.value.files.sort(comparator),
        ...openedFolder.value.symlinks.sort(comparator),
        ...openedFolder.value.fifos.sort(comparator),
        ...openedFolder.value.charDevs.sort(comparator),
        ...openedFolder.value.blockDevs.sort(comparator),
        ...openedFolder.value.sockets.sort(comparator),
    ];
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


Object.defineProperty(globalThis, "list", {
    get() {
        return list.value;
    }
});
Object.defineProperty(globalThis, "names", {
    get() {
        return list.value.map(entry => entry.name);
    }
});
