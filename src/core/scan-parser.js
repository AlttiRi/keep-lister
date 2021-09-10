import {parseFlatScan} from "./entry.js";
import {appendScript} from "../util.js";

let pakoIsLoaded = false;
async function loadPako() {
    if (!pakoIsLoaded) {
        const src = "https://cdn.jsdelivr.net/npm/pako@2.0.4/dist/pako_inflate.min.js";
        const integrity = "sha256-ZIKs3+RZEULSy0dR6c/mke8V9unZm9vuh05TqvtMdGU=";
        await appendScript(src, integrity);
        pakoIsLoaded = true;
        console.log("pako is loaded");
    }
}

/**
 * @param {Response|Blob} input
 * @return {Promise<*>}
 */
async function unGZipJSON(input) {
    await loadPako();

    const inflator = new pako.Inflate();
    const ab = await input.arrayBuffer();
    inflator.push(ab);
    if (inflator.err) {
        console.error(inflator.msg);
    }
    return JSON.parse(new TextDecoder().decode(inflator.result));
}

/**
 * @param {Blob|Response} input
 * @return {Promise<{meta: ScanMeta, root: SimpleEntry}>}
 */
export async function parseScan(input) {
    /**
     * @see FlatScanResult
     * @type {Object[]} flatScan */
    let flatScan;

    if (input instanceof Response) {
        /** @type {Response} */
        const response = input;

        // If "content-type" is "application/json" or "application/json; charset=utf-8"
        // and "content-encoding" is "gzip"
        // the browser will unGZip it itself.
        /* const contentEncoding = response.headers.get("content-encoding"); */
        const contentType = response.headers.get("content-type");
        if (isGZip(contentType)/* && contentEncoding === null */) {
            flatScan = await unGZipJSON(response);
        } else if (isJSON(contentType)) {
            flatScan = await response.json();
        }
    } else if (input instanceof Blob) {
        /** @type {Blob} */
        const blob = input;

        if (isGZip(blob.type)) {
            flatScan = await unGZipJSON(blob);
        } else if (isJSON(blob.type)) {
            flatScan = JSON.parse(await blob.text());
        }
    }

    /** @type {ScanMeta} */
    const meta = flatScan[0];
    /** @type {SerializableScanEntry[]} */
    const sEntries = flatScan.slice(1);


    console.time("parseEntries");
    /** @type {SimpleEntry} */
    const root = await parseFlatScan(sEntries);
    console.timeEnd("parseEntries");

    return {meta, root};
}

/**
 * "application/x-gzip"
 * "application/gzip"
 * @param contentType
 * @return {Boolean}
 */
function isGZip(contentType) {
    return Boolean(contentType.match(/^application\/.*?gzip/));
}
/**
 * "application/json"
 * "application/json; charset=utf-8"
 * @param contentType
 * @return {Boolean}
 */
function isJSON(contentType) {
    return Boolean(contentType.match(/^application\/.*?json/));
}
