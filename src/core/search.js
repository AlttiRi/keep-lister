import {isReactive, ref, toRaw, watch} from "vue";
import {blue, bytesToSizeWinLike, debounce, sleep} from "../util.js";
import {openedFolder} from "./folders.js";
import {comparator, limit, orderBy,  reverseOrder} from "./entries.js";
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

watch([orderBy, reverseOrder], () => {
    if (searchResult.value.length) {
        console.time("sort searchResult");
        searchResult.value = searchResult.value.sort(comparator);
        console.timeEnd("sort searchResult");
        //todo sort by parts
    }
});

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
    const searchText = result.customSearchText || request;
    debug.appendMessage(`${result.length} items; size: ${bytesToSizeWinLike(filesSize)} (${bytesToSizeWinLike(allSize)});  search: ${searchText}`);
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


    if (["https://", "http://"].some(prefix => search.startsWith(prefix))) {
        const url = new URL(search);
        const resourceFullName = url.pathname.match(/[^\/]+$/)?.[0];
        if (!resourceFullName) {
            return [];
        }
        const {
            name: resName,
            ext: resExt,
        } = resourceFullName.match(/(?<name>.+)(\.(?<ext>.+))$/)?.groups || {name: resourceFullName};
        return justSearch(resName);
    }


    /**
     * @example
     * /size:0       - find 0 byte size entries
     * /size/120     - the same, find 120 bytes size entries
     * /size:120+80  - find from 120 to 200
     * /size:120+80  - find from 120 to 200
     * /size:120+-20 - find from 100 to 120
     * /size:120~20  - find from  80 to 140
     * /size:120-220 - find from 120 to 220
     * /size:220-120 - find from 120 to 220
     * //todo
     * /size:120~    - find from 120 -5% to 120 +5%
     * /size:120~~   - find from 120-10% to 120+10%
     * /size:120~~~  - find from 120-15% to 120+15%
     */
    if (search.startsWith("/size")) {
        const {
            /** @type {String|undefined} */
            size,
            /** @type {String|undefined} */
            plus,
            /** @type {String|undefined} */
            plusRange,
            /** @type {String|undefined} */
            range,
        } = search.match(/\/size[:\/](?<size>\d+)(\+(?<plus>(\d+)|(-\d+))|~(?<plusRange>\d+)|-(?<range>\d+))?/)?.groups || {};
        if (size) {
            console.log({size, plus, plusRange, range});

            let text;
            let result;
            const _size = Number(size);

            if (plus) {
                const _plus = _size + Number(plus);
                const {min, max} = _size < _plus ? {min: _size, max: _plus} : {min: _plus, max: _size};
                text = `Size search from ${bytesToSizeWinLike(min)} to ${bytesToSizeWinLike(max)}`;
                result = await findAll(folder, entry => {
                    return entry.size >= min && entry.size <= max;
                });
            } else
            if (range) {
                const _range = Number(range);
                const {min, max} = _size < _range ? {min: _size, max: _range} : {min: _range, max: _size};
                text = `Size search from ${bytesToSizeWinLike(min)} to ${bytesToSizeWinLike(max)}`;
                result = await findAll(folder, entry => {
                    return entry.size >= min && entry.size <= max;
                });
            } else
            if (plusRange) {
                const min = _size - Number(plusRange);
                const max = _size + Number(plusRange);
                text = `Size search from ${bytesToSizeWinLike(min)} to ${bytesToSizeWinLike(max)}`;
                result = await findAll(folder, entry => {
                    return entry.size >= min && entry.size <= max;
                });
            } else {
                text = `Size search ${bytesToSizeWinLike(_size)}`;
                result = await findAll(folder, entry => {
                    return entry.size === _size;
                });
            }
            console.log(...blue(text));
            Object.defineProperty(result, "customSearchText", {
                value: text
            });
            return result;
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
