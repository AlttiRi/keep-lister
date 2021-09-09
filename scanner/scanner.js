import path from "path";
import fs from "fs";
import os from "os";
import pako from "../node_modules/pako/dist/pako_deflate.min.js";
import {
    ANSI_CYAN,
    ANSI_GREEN,
    ANSI_GREEN_BOLD,
    ANSI_RED_BOLD,
    dateToDayDateString,
    exists,
    listFiles
} from "./util-node.js";
import {fileURLToPath} from "url";
import {Meta} from "./meta.js";
import {FlatScanObject} from "./flat-scan-object.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------

const doGZip = true;
const logging = false;

const scanFolderPath = ".";
const scanFolderAbsolutePath = path.resolve(scanFolderPath);

const pathChunks = chunkifyPath(scanFolderAbsolutePath);
const scanPath = pathChunks.slice(0, -1);
const scanDirName = pathChunks[pathChunks.length - 1];

const scanPathStr = scanPath.join(path.sep).replace("//", "/");
console.log("Scanning:", ANSI_GREEN(scanPathStr ? scanPathStr + path.sep : "") + ANSI_GREEN_BOLD(scanDirName));
const startTime = Date.now();


const meta = new Meta(scanPath);
/** @type {ScanEntry} */
const rootEntry = await handleListEntry({path: scanFolderAbsolutePath});
const scanObject = new FlatScanObject(rootEntry, scanDirName);

for await (const /** @type {ListEntry} */ listEntry of listFiles({
    filepath: scanFolderPath,
    recursively: true,
    emitDirectories: true
}, false)) {
    const scanEntry = await handleListEntry(listEntry);
    meta.increaseErrorCounter(scanEntry);
    scanObject.add(scanEntry);
}


meta.logTable();

/** @type {SerializableScanEntry[]} */
const scanEntries = scanObject.values;
const json = createJSON(meta, scanEntries);
await saveJSON(json);

console.log("Executing time:\t", (Date.now() - startTime)/1000, "seconds");

// -------

/**
 * @param {string} pathStr
 * @return {string[]}
 */
function chunkifyPath(pathStr) {
    const _pathStr = path.normalize(pathStr);
    const pathChunks = _pathStr.split(path.sep).filter(e => e);
    if (_pathStr.startsWith("/") && path.isAbsolute(_pathStr)) { // for linux
        pathChunks.unshift("/");
    }
    return pathChunks;
}

/**
 * @typedef {
 * "folder" |
 * "file" |
 * "symlink" |
 * "fifo" |
 * "charDev" |
 * "blockDev" |
 * "socket"
 * } ScanEntryType
 */

/**
 * @param {import("fs/promises").Dirent} dirent
 * @return {ScanEntryType}
 */
function typeFromDirent(dirent) {
    if (dirent.isFile()) {
        return "file";
    }
    if (dirent.isDirectory()) {
        return "folder";
    }
    if (dirent.isSymbolicLink()) {
        return "symlink";
    }
    if (dirent.isFIFO()) {
        return "fifo";
    }
    if (dirent.isCharacterDevice()) {
        return "charDev";
    }
    if (dirent.isBlockDevice()) {
        return "blockDev";
    }
    if (dirent.isSocket()) {
        return "socket";
    }
}


/**
 * Scan error. Scan result representation of `IOError`.
 * @typedef {IOError} ScanError
 **/

/**
 * @typedef {Object} ScanEntryBase
 * @property {string} path
 * @property {ScanEntryType} type
 * @property {ScanError} [error]
 **/

/**
 * @typedef {Object} ScanSymlinkInfo
 * @property {string} [pathTo]
 * @property {string} [content]
 * @property {ScanError} [error]
 **/

/**
 * @typedef {Object} ScanStatsInfo
 * @property {import("fs").Stats} [stats]
 * @property {ScanError} [error]
 **/

/**
 * @typedef {ScanEntryBase} ScanEntry
 * @property {ScanStatsInfo} statsInfo
 * @property {ScanSymlinkInfo} linkInfo
 **/

/** @param {ScanEntryBase} entry
 * @return {ScanStatsInfo} */
async function statsInfo(entry) {
    try {
        /** @type {fs.Stats} */
        const stats = await fs.promises.lstat(entry.path);
        return {stats};
    } catch (error) {
        logging && console.log(ANSI_RED_BOLD("[stat]: " + JSON.stringify(error)));
        return {error};
    }
}
/** @param {ScanEntryBase} entry
 * @return {ScanSymlinkInfo} */
async function linkInfo(entry) {
    if (entry.type !== "symlink") {
        return;
    }
    try {
        const symContent = await fs.promises.readlink(entry.path);
        const linkLocation = path.dirname(entry.path);
        const absolutePathTo = path.resolve(linkLocation, symContent);
        logging && console.info(entry.path, ANSI_CYAN("->"), absolutePathTo);
        return {
            pathTo: absolutePathTo,
            content: symContent,
        }
    } catch (error) {
        logging && console.log(ANSI_RED_BOLD("[readlink]: " + JSON.stringify(error)));
        return {error};
    }
}

/** @param {ListEntry} listEntry
 *  @return {ScanEntryBase} */
function createScanEntryBase(listEntry) {
    const {
        dirent,
        path,
        error: readdirError
    } = listEntry;

    /** @type {ScanEntryType} */
    const type = dirent ? typeFromDirent(dirent) : "folder"; // "folder" for `readdir` error and for root
    const entry = {
        path,
        type
    };
    if (readdirError) {
        entry.error = readdirError;
        logging && console.log(ANSI_RED_BOLD("[readdir]: " + JSON.stringify(entry.error)));
    } else {
        if (entry.path !== scanFolderAbsolutePath) { // in order do not count the scan folder
            meta.increaseTypeCounter(type);
        }
    }

    return entry;
}

/** @param {ListEntry} listEntry
 * @return {ScanEntry} */
async function handleListEntry(listEntry) {
    /** @type {ScanEntry} */
    const scanEntry = createScanEntryBase(listEntry);
    if (scanEntry.error) { // `readdir` error
        return scanEntry;
    }
    scanEntry.statsInfo = await statsInfo(scanEntry);
    if (scanEntry.type === "symlink") {
        scanEntry.linkInfo = await linkInfo(scanEntry);
    }
    return scanEntry;
}

/** @typedef {ScanMeta|SerializableScanEntry} FlatScanResultEntry */

/**
 *  The first element is ScanMeta, others — SerializableScanEntry.
 *  @typedef {FlatScanResultEntry[]} FlatScanResult
 **/

/**
 *
 * Meta + SerializableScanEntry's on each line
 * The root folder should be the first and with id=0, pid=null.
 *
 * @param {Meta} meta
 * @param {SerializableScanEntry[]} sEntries
 * @return {string}
 */
function createJSON(meta, sEntries) {
    return  "[\n" +
            meta.toFormattedJSON() + ",\n" +
            "\n" +
            sEntries.map(e => JSON.stringify(e)).join(",\n") + "\n" +
            "]";
}
async function saveJSON(json) {
    const filename =
        "[.dir-scan]" +
        "[" + scanFolderAbsolutePath.replaceAll(path.sep, "/") + "]" +
        " " + dateToDayDateString(new Date(), false);
    const ext = doGZip ? ".json.gz" : ".json";
    const filenameEscaped = filename
        // .replaceAll("/", "⧸") .replaceAll(":", "：").replaceAll("#", "⋕")
        .replaceAll(/[/:#]/g, "~");


    const resultFilename = filenameEscaped + ext;
    const gzippedJson = doGZip ? pako.gzip(json) : json;

    try {
        let saveLocation;
        const downloads = path.join(os.homedir(), "Downloads");

        if (await exists(downloads)) {
            saveLocation = downloads;
        } else {
            console.log("Download folder is not detected.");
            saveLocation = __dirname; // near the .mjs file
            // process.cwd();
        }
        console.log("Writing to:\t", ANSI_GREEN(saveLocation));
        const fullPath = path.join(saveLocation, resultFilename);
        fs.writeFileSync(fullPath, gzippedJson);
        console.log("Result file:\t", ANSI_GREEN(resultFilename));
    } catch (e) {
        console.log("Write error", e);
        throw e;
    }
}
