import {isReactive, markRaw, ref, toRaw, watch} from "vue";
import {bytesToSizeWinLike, debounce, sleep} from "../util.js";
import {openedFolder} from "./folders.js";
import {comparator, limit} from "./entries.js";
import * as debug from "./debug.js";
import {entryTypes} from "./entry.js";

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
    /** @type {SimpleEntry[]} */
    const rawResult = toRaw(result);
    searchResult.value = rawResult;
    limit.value = 50;

    addSearchResultToGlobalThis(rawResult);
}

/** @param {SimpleEntry[]} rawResult */
function addSearchResultToGlobalThis(rawResult) {
    /** @type {SimpleEntry[]} */
    globalThis.search = rawResult;
    console.log("globalThis.search:", rawResult);
    Object.defineProperty(globalThis.search, "download", {
        get() {
            console.log("download"); // todo
        }
    });
    Object.defineProperty(globalThis.search, "names", {
        get() {
            return globalThis.search.map(entry => entry.name);
        }
    });
    Object.defineProperty(globalThis.search, "namelist", {
        get() {
            return globalThis.search.map(entry => entry.name).join("\n");
        }
    });
}

//todo check linked list perf for large search // do search after scan parsing ended
const performSearchDebounced = debounce(performSearch, 300);
async function performSearch() {
    const folder = openedFolder.value;
    const request = search.value;

    // Do unProxy. Up to x40 in comparison with default reactive ref.
    const folderRaw = isReactive(folder) ? toRaw(folder) : folder;

    const time1 = performance.now();
    const result = await searcher(folderRaw, request);
    if (!result) {
        return;
    }
    const searchTime = performance.now() - time1;
    debug.addMessage(`Search time: ${searchTime.toFixed(2)} ms; `);
    await sleep();

    const time2 = performance.now();
    const sortedResult = result.sort(comparator);
    const sortTime = performance.now() - time2;
    debug.appendMessage(`Sort time: ${sortTime.toFixed(2)} ms; `);
    await sleep();

    console.time("search result size computing");
    const resultSet = new Set(result);
    const allSize = result.reduce((acc, val) => computeEntrySize(val, resultSet) + acc, 0);
    const filesSize = result.filter(entry => entry.type !== "folder").reduce((acc, val) => val.size + acc, 0);
    console.timeEnd("search result size computing");
    console.log(allSize, filesSize);

    setSearchResult(sortedResult);
    debug.appendMessage(`${result.length} items; size: ${bytesToSizeWinLike(filesSize)} (${bytesToSizeWinLike(allSize)});  search: ${request}`);
}


/**
 * The recursive size computing of an `SimpleEntry`.
 * Skips the entries of `excludeSet`.
 * @param {SimpleEntry} entry
 * @param {Set<SimpleEntry>} excludeSet
 * @return {Number}
 */
function computeEntrySize(entry, excludeSet) {
    if (entry.type !== "folder") {
        return entry.size;
    }
    let childrenSize = 0;
    for (const child of entry.children || []) {
        if (excludeSet.has(entry)) {
            continue;
        }
        if (child.type === "folder") {
            childrenSize += computeEntrySize(child, excludeSet);
        } else {
            childrenSize += child.size;
        }
    }
    return childrenSize;
}

/**
 * @param {SimpleEntry} folder
 * @param {string} search
 * @return {Promise<SimpleEntry[]|false>}
 */
async function searcher(folder, search) { // "đ Crème Bruląśćńżółźćęéйeё".normalize("NFD").replace(/\p{Diacritic}/gu, "")
    if (search.startsWith("//")) {
        return justSearch(search.slice(2));
    }

    if (search.startsWith("/size")) {
        const {
            /** @type {String|undefined} */
            size
        } = search.match(/\/size[:\/](?<size>\d+)/)?.groups || {};
        if (size) {
            console.log(size);
            return findAll(folder, entry => {
                return entry.size.toString() === (size);
            });
        } else {
            console.log("no size to search");
        }
    }
    if (search.startsWith("/")) {
        const {type, word} = search.match(/\/type:(?<type>[^\/]+)\/?(?<word>[^\/]*)/)?.groups || {};
        if (type) {
            console.log({type, word});
            if (entryTypes.includes(type)) {
                return findAll(folder, entry => {
                    return entry.type === type && entry.name.includes(word);
                });
            }
        }
    } else if (search.includes(" ")) {
        const parts = search.split(" ").filter(o => o);
        if (parts.length > 1) {
            let result = await justSearch(parts.shift());
            let curWord;
            while (curWord = parts.shift()) {
                result = result.filter(entry => entry.name.includes(curWord));
            }
            return result;
        }
    }
    return justSearch(search);

    function justSearch(search) {
        return findAll(folder, (entry) => {
            return entry.name.includes(search);
        });
    }
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
