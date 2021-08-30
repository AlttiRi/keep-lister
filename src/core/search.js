import {isReactive, markRaw, ref, toRaw, watch} from "vue";
import {debounce, sleep} from "../util.js";
import {openedFolder} from "./folders.js";
import {comparator} from "./entries.js";
import * as debug from "./debug.js";

/** @type {import("vue").Ref<string>} */
export const search = ref(""); // [v-model]
export function clearSearch() {
    search.value = "";
}

/** @type {import("vue").Ref<SimpleEntry[]>} */
export const searchResult = ref([]);
function clearSearchResult() {
    setSearchResult([]);
}
/** * @param {SimpleEntry[]} result */
function setSearchResult(result) {
    searchResult.value = markRaw(result);

    console.log("globalThis.search:", globalThis.search = result);
    Object.defineProperty(globalThis.search, "download", {
        get() {
            console.log("download"); // todo
        }
    });
}

//todo search by type
// /type:folder/
//todo check linked list perf for large search
const performSearchDebounced = debounce(performSearch, 300);
async function performSearch() {
    const folder = openedFolder.value;
    const word = search.value;

    const time1 = performance.now();
    // Do unProxy. Up to x40 in comparison with default reactive ref.
    const folderRaw = isReactive(folder) ? toRaw(folder) : folder;
    const result = await findAll(folderRaw, (entry) => {
        return entry.name.includes(word);
    });
    const searchTime = performance.now() - time1;
    debug.addMessage(`Search time: ${searchTime.toFixed(2)} ms; `);
    await sleep();

    const time2 = performance.now();
    const sortedResult = result.sort(comparator);
    const sortTime = performance.now() - time2;
    debug.appendMessage(`Sort time: ${sortTime.toFixed(2)} ms; `);
    await sleep();

    setSearchResult(sortedResult);
    debug.appendMessage(`${result.length} items; search: ${word}`);
}

watch(search, async (newValue, oldValue) => {
    const isEmptyString = !newValue;
    if (isEmptyString) {
        clearSearchResult();
        return;
    }
    // In order to "no debounce by paste event"
    if (newValue.length - oldValue.length > 1) {
        await performSearch();
    } else {
        await performSearchDebounced();
    }
});

/**
 * @param {SimpleEntry} folder
 * @param {function(SimpleEntry)} predicate
 * @return {Promise<SimpleEntry[]>}
 */
async function findAll(folder, predicate) {
    let res = [];
    let time = Date.now();
    for (const entries of listAllEntries(folder)) {
        const curTime = Date.now();
        if (curTime - time > 15) {
            time = curTime;
            await sleep();
        }
        for (const entry of entries) {
            if (predicate(entry)) {
                res.push(entry);
            }
        }
    }
    return res;
}

/**
 * List all entries by parts.
 * @param {SimpleEntry} folder
 * @return {Generator<SimpleEntry[]>}
 */
function *listAllEntries(folder) {
    const partSize = 1000;
    /** @type {SimpleEntry[]} */
    let list = [];
    /** @param {SimpleEntry} folderEntry */
    function *takePart(folderEntry) {
        for (const entry of (folderEntry.children || [])) {
            if (entry.type === "folder") {
                yield *takePart(entry);
            }
            list.push(entry);
            if (list.length === partSize) {
                yield list;
                list = [];
            }
        }
    }
    yield *takePart(folder);
    yield list;
}
