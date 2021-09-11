import {parseFlatScan} from "./entry.js";
import {appendScript, iterateArrayBuffer, sleep} from "../util.js";

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
 * @param {ArrayBuffer} arrayBuffer
 * @return {Generator<Uint8Array>}
 */
function *unZipIterator(arrayBuffer) {
    const inflator = new pako.Inflate();
    for (const u8Array of iterateArrayBuffer(arrayBuffer, 65536/2)) {
        inflator.push(u8Array);
        for (const chunk of inflator.chunks) {
            yield chunk;
        }
        inflator.chunks = [];
    }
    yield inflator.result;
    if (inflator.err) {
        console.error(inflator.msg);
    }
}

/**
 * @param {Response|Blob} input
 * @return {Promise<*>}
 */
async function unGZipJSON(input) {
    await loadPako();
    const ab = await input.arrayBuffer();

    const decoder = new TextDecoder();
    let partObjects = [];

    const parser = new Parser();
    let i = 0, time = 0;
    for (const uint8Array of unZipIterator(ab)) {
        if (!(i++ % 20)) {
            const timeNow = Date.now();
            if (timeNow - time > 15) {
                time = timeNow;
                await sleep();
                // console.log("sleep", i);
            }
        }
        const textPart = decoder.decode(uint8Array, {stream: true});
        partObjects.push(parser.parse(textPart));
    }
    return partObjects.flat();
}

export class Parser {
    buffer = null;
    startHandled = false;
    metaLines = [];
    objects = [];

    handleStart(line) {
        if (line === "[") { // the first line
            return;
        }
        if (line === "") { // meta is separated from the main content by "\n"
            this.objects.push(this.metaLines.join(""));
            this.startHandled = true;
            return;
        }
        this.metaLines.push(line);
    }

    trimComma(text) {
        return text.endsWith(",") ? text.slice(0, -1) : text;
    }

    handleEntry(line, isLastLine) {
        if (isLastLine) {
            this.buffer = line;
            return;
        }
        if (this.buffer) {
            this.objects.push(this.buffer + line);
            this.buffer = null;
        } else {
            this.objects.push(line);
        }
    }

    parse(textPart) {
        const isLastPart = textPart.endsWith("\n]");
        /** @type {String[]} */
        const lines = textPart.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const isLastLine = i === lines.length - 1;

            if (isLastLine && isLastPart) {
                continue;
            }

            if (!this.startHandled) {
                this.handleStart(line, isLastLine);
            } else {
                this.handleEntry(line, isLastLine);
            }
        }
        const result = JSON.parse(`[${this.trimComma(this.objects.join(""))}]`);
        this.objects = [];
        return result;
    }

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

    console.time("parse-json");
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
    console.timeEnd("parse-json");

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
