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
    const request = search.value;

    const time1 = performance.now();
    const result = await justFind(folder, request);
    const searchTime = performance.now() - time1;
    debug.addMessage(`Search time: ${searchTime.toFixed(2)} ms; `);
    await sleep();

    const time2 = performance.now();
    const sortedResult = result.sort(comparator);
    const sortTime = performance.now() - time2;
    debug.appendMessage(`Sort time: ${sortTime.toFixed(2)} ms; `);
    await sleep();

    setSearchResult(sortedResult);
    debug.appendMessage(`${result.length} items; search: ${request}`);
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
