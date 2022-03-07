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
        if (excludeSet.has(child)) {
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

        let searchText;
        if (url.hostname === "www.youtube.com" && url.pathname === "/watch") {
            searchText = url.searchParams.get("v");
        } else {
            const pathnameEndsWithSlash = url.pathname.length > 1 && url.pathname.endsWith("/");
            const pathname = pathnameEndsWithSlash ? url.pathname.slice(0, -1) : url.pathname;
            const resourceFullName = pathname.match(/[^\/]+$/)?.[0];
            if (!resourceFullName) {
                return [];
            }
            const {
                name: resName,
                ext: resExt, // [note] it can be not the file extension, but a part of a nickname (inst url, for example)
            } = resourceFullName.match(/(?<name>.+)(\.(?<ext>.+))$/)?.groups || {name: resourceFullName};
            searchText = resName + ((pathnameEndsWithSlash && resExt) ? `.${resExt}` : "");
        }

        const result = await justSearch(searchText);
        Object.defineProperty(result, "customSearchText", {
            value: searchText
        });
        return result;
    }


    /**
     * @example
     * /size:0       - find 0 byte size entries
     * /size/120     - the same, find 120 bytes size entries
     * /size:120+80  - find from 120 to 200
     * /size:120+-20 - find from 100 to 120
     * /size:120~20  - find from  80 to 140
     * /size:120-220 - find from 120 to 220
     * /size:220-120 - find from 120 to 220
     * /size:^2      - size.toString() starts with "2"
     * /size:%2      - size.toString() includes    "2"
     * /size:$0      - size.toString() ends with   "0"
     * /s/0          - find 0 byte size entries, just a short form
     * /s/120 900    - find 120900 bytes size entries
     * /s/120,900    - find 120900 bytes size entries
     *
     * /size:120~    - find from 120 -5% to 120 +5%
     * /size:120~~   - find from 120-10% to 120+10%
     * /size:120~~~  - find from 120-15% to 120+15%
     *
     * /sizek:5      - find 5 KB ± 0.1 KB
     * /sizek:50     - find 50 KB  ± 1 KB
     * /sizek:500    - find 500 KB ± 1 KB
     * /sizem:5      - find 5 MB ± 0.1 MB
     * /sizeg/50     - find 50 GB ± 1 GB
     *
     * /size:5m      - find 5 MB ± 0.1 MB
     *
     * /s/12.9       - find 12 bytes size entries
     * /sk/12.9      - find 12.9 KB ± 1 KB
     *
     * /sizek:5!     - find 5 KB + (0 - 0.01) KB
     * /sizek:5!!    - find 5 KB + (0 - 0.001) KB
     * /s/5k!!       - find 5 KB + (0 - 0.001) KB
     * /sizem:50!    - find 50 MB + (0 - 0.1) MB
     * /sizem:50!!   - find 50 MB + (0 - 0.01) MB
     */
    const r1 = `\\/s(ize)?(?<defaultPrefix>b|k|m|g|t)?[:\\/]`;
    if (search.match(new RegExp(r1))) {
        const r2   = `(?<extra1>(?<caret>\\^)|(?<dollar>\\$)|(?<percent>%))?`;
        const r3   = `((?<sizeString1>\\s*\\d[\\d\\s\\,]*)((?<dotDecimal1>\\.(?<decimal1>\\d+)?))?(?<prefix1>b|k|m|g|t)?(?<exclamations>!+)?)`;

        const r4_1 = `(?<extra2>(?<plus>\\+)|(?<minus>\\-)|(?<tildes>\\~+))`;
        const r4_2 = `((?<sizeString2>\\s*-?\\s*\\d[\\d\\s\\,]*)((?<dotDecimal2>\\.(?<decimal2>\\d+)?))?(?<prefix2>b|k|m|g|t)?)?`;
        const r4   = `(?<range>${r4_1}${r4_2})?`;

        const regex = new RegExp(r1 + r2 + r3 + r4);

        const {
            /** @type {"b"|"k"|"m"|"g"|"t"|undefined} */
            defaultPrefix,

            /** @type {String|undefined} */
            caret,
            /** @type {String|undefined} */
            dollar,
            /** @type {String|undefined} */
            percent,

            /** @type {String|undefined} */
            sizeString1,
            /** @type {String|undefined} */
            decimal1,
            /** @type {String|undefined} */
            prefix1,
            /** @type {String|undefined} */
            exclamations,

            /** @type {String|undefined} */
            plus,
            /** @type {String|undefined} */
            minus,
            /** @type {String|undefined} */
            tildes,

            /** @type {String|undefined} */
            sizeString2,
            /** @type {String|undefined} */
            decimal2,
            /** @type {String|undefined} */
            prefix2,

        } = search.match(regex)?.groups || {};

        if (sizeString1) {
            console.log({
                defaultPrefix,
                extra1: {caret, dollar, percent},
                sizeString1, decimal1, prefix1, exclamations,
                extra2: {plus, minus, tildes, sizeString2, decimal2, prefix2},
            });

            let text;
            let result;

            let sizeNum = Number(sizeString1.replaceAll(/[\s,]/g, ""));
            const size = sizeNum.toString();

            let size2Num = sizeString2 && Number(sizeString2.replaceAll(/[\s,]/g, ""));
            const size2 = size2Num?.toString();


            const dec1 = decimal1 ? Number("0." + decimal1) : 0;
            const dec2 = decimal2 ? Number("0." + decimal2) : 0;
            sizeNum  = multiplyByPrefix(sizeNum  + dec1, prefix1 || defaultPrefix);
            size2Num = multiplyByPrefix(size2Num + dec2, prefix2 || defaultPrefix);


            /**
             * @param {Number} a
             * @param {Number} b
             * @return {Promise<void>}
             */
            async function rangeSearch(a, b) {
                const {_min, max} = a < b ? {_min: a, max: b} : {_min: b, max: a};
                const min = Math.max(0, _min);
                text = `Size search from ${bytesToSizeWinLike(min)} to ${bytesToSizeWinLike(max)}`;
                result = await findAll(folder, entry => {
                    return entry.size >= min && entry.size <= max;
                });
            }
            function multiplyByPrefix(value, prefix = "b") {
                if (value === undefined) {
                    return;
                }
                const prefixes = ["b", "k", "m", "g", "t"];
                return Math.trunc(value * (1024 ** prefixes.indexOf(prefix)));
            }


            if (caret) { // ^
                text = `Size search starts with "${size}"`;
                result = await findAll(folder, entry => {
                    return entry.size.toString().startsWith(size);
                });
            } else
            if (dollar) { // $
                text = `Size search ends with "${size}"`;
                result = await findAll(folder, entry => {
                    return entry.size.toString().endsWith(size);
                });
            } else
            if (percent) { // %
                text = `Size search includes "${size}"`;
                result = await findAll(folder, entry => {
                    return entry.size.toString().includes(size);
                });
            } else
            if (plus && size2) { // +
                await rangeSearch(sizeNum, sizeNum + size2Num);
            } else
            if (minus && size2) { // -
                await rangeSearch(sizeNum, size2Num);
            } else
            if (tildes) {  // ~ // ~~ // ~~~
                if (size2) {
                    await rangeSearch(sizeNum - size2Num, sizeNum + size2Num);
                } else {
                    const count = tildes.length;
                    const diff = Math.trunc(sizeNum * 5 * count / 100);
                    await rangeSearch(sizeNum - diff, sizeNum + diff);
                }
            } else { // Default
                const prefix = prefix1 || defaultPrefix;
                if (prefix && prefix !== "b") {

                    let orders = size.length;
                    let diff = multiplyByPrefix(1, prefix);
                    if (orders === 1) {
                        diff = Math.trunc(diff / 10);
                    }

                    let from = sizeNum - diff;
                    let to   = sizeNum + diff;
                    if (exclamations) {
                        from = sizeNum;
                        if (exclamations.length > 1) {
                            to = sizeNum + Math.trunc(diff / 10);
                        }
                    }
                    await rangeSearch(from, to);
                } else {
                    text = `Size search ${bytesToSizeWinLike(sizeNum)}`;
                    result = await findAll(folder, entry => {
                        return entry.size === sizeNum;
                    });
                }
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
