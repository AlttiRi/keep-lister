import {EntryStreamParser} from "./entry.js";
import {appendScript, iterateAsyncDataSource, sleep} from "../util.js";


/**
 * @param {Blob|Response} input
 * @return {AsyncGenerator<{meta:ScanMeta, root: SimpleEntry, rootUpdated: boolean}>}
 */
export async function *parseScan(input) {
    const parser = new EntryStreamParser();

    let contentType;
    if (input instanceof Response) {
        contentType = input.headers.get("content-type");
    } else if (input instanceof Blob) {
        contentType = input.type;
    }
    /** @type {ScanMeta} */
    let meta;
    if (isGZip(contentType)) {
        console.log("parseGZippedJSONScan");
        for await (const obj of parseGZippedJSONScan(input)) {
            if (!meta) {
                meta = /** @type {ScanMeta} */ obj.shift();
            }
            yield {meta, ...parser.parse(/** @type {SerializableScanEntry[]} */ obj)};
        }
    } else if (isJSON(contentType)) {
        console.log("streamParseJSONScan");
        for await (const array of streamParseJSONScan(input)) {
            if (!meta) {
                meta = /** @type {ScanMeta} */ array.shift();
            }
            yield {meta, ...parser.parse(/** @type {SerializableScanEntry[]} */ array)};
        }
    }
    parser.processHIDMapAsync();
}


/**
 * @param {Response|ReadableStream|Blob} input
 * @return {AsyncGenerator<FlatScanResultEntry[]>}
 */
async function *streamParseJSONScan(input) {
    const decoder = new TextDecoder();
    const textParser = new TextParser();
    let i = 0, time = 0;
    for await (const uint8Array of iterateAsyncDataSource(input)) {
        if (!(i++ % 10)) {
            const timeNow = Date.now();
            if (timeNow - time > 15) {
                time = timeNow;
                await sleep();
                // console.log("sleep", i);
            }
        }
        const textPart = decoder.decode(uint8Array, {stream: true});
        const scanResultEntries = textParser.parsePart(textPart);
        if (scanResultEntries.length) {
            yield scanResultEntries;
        }
    }
}

/**
 * @param {Response|Blob} input
 * @return {AsyncGenerator<FlatScanResultEntry[]>}
 */
async function *parseGZippedJSONScan(input) {
    const decoder = new TextDecoder();
    const textParser = new TextParser();
    let i = 0, time = 0;
    for await (const uint8Array of unGZipAsyncIterator(input)) {
        if (!(i++ % 20)) {
            const timeNow = Date.now();
            if (timeNow - time > 15) {
                time = timeNow;
                await sleep();
                // console.log("sleep", i);
            }
        }
        const textPart = decoder.decode(uint8Array, {stream: true});
        const scanResultEntries = textParser.parsePart(textPart);
        if (scanResultEntries.length) {
            yield scanResultEntries;
        }
    }
}

/**
 * @param {Response|ReadableStream|Blob} input
 * @return {Generator<Uint8Array>}
 */
async function *unGZipAsyncIterator(input) {
    if (!isPakoLoaded()) {
        await loadPako();
    }
    let chunks = [];
    const inflator = new pako.Inflate();
    pako.Inflate.prototype.onData = function (chunk) {
        chunks.push(chunk);
    };
    for await (const u8Array of iterateAsyncDataSource(input)) {
        inflator.push(u8Array);
        for (const chunk of chunks) {
            yield chunk;
        }
        chunks = [];
    }
    yield inflator.result;
    if (inflator.err) {
        console.error(inflator.msg);
    }
}


export class TextParser {
    buffer = "";
    startHandled = false;
    metaLines = [];
    objects = [];

    trimComma(text) {
        return text.endsWith(",") ? text.slice(0, -1) : text;
    }

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

    /**
     * @param {String} line
     * @param isLastLine
     */
    handleLine(line, isLastLine) {
        if (isLastLine) {
            this.buffer += line;
            return;
        }
        if (this.buffer) {
            this.objects.push(this.buffer + line);
            this.buffer = "";
        } else {
            this.objects.push(line);
        }
    }

    /**
     * May return an empty array
     * @param {String} textPart
     * @return {FlatScanResultEntry[]}
     * */
    parsePart(textPart) {
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
                this.handleLine(line, isLastLine);
            }
        }
        try {
            /** @type {FlatScanResultEntry[]} */
            const result = JSON.parse(`[${this.trimComma(this.objects.join(""))}]`);
            this.objects = [];
            return result;
        } catch (e) {
            console.log(`[${this.trimComma(this.objects.join(""))}]`);
            console.log(this.objects);
            console.log(this, {isLastPart, textPart});
            throw e;
        }

    }

}


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
function isPakoLoaded() {
    return pakoIsLoaded;
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
