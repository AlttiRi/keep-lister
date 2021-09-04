import path from "path";
import fs from "fs";
import os from "os";
import {
    listFiles,
    dateToDayDateString,
    exists,
    ANSI_GREEN,
    ANSI_GREEN_BOLD,
    ANSI_RED_BOLD, ANSI_CYAN
} from "./util-node.js";
import {fileURLToPath} from "url";
import {TreeScanObject} from "./tree-scan-object.js";
import {Meta} from "./meta.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const scanFolderPath = ".";
const scanFolderAbsolutePath = path.resolve(scanFolderPath);

const chunks = chunkifyPath(scanFolderAbsolutePath);
const scanPath = chunks.slice(0, -1);
const scanDirName = chunks[chunks.length - 1];

const scanPathStr = scanPath.join(path.sep).replace("//", "/");
console.log("Scanning:", ANSI_GREEN(scanPathStr ? scanPathStr + path.sep : "") + ANSI_GREEN_BOLD(scanDirName));

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


const treeScan = new TreeScanObject({
    scanFolderAbsolutePath,
    scanDirName
});

const meta = new Meta(scanPath);

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
 * @typedef {Object} ScanSymlinkInfo
 * @property {string} pathTo
 * @property {string} [content]
 **/
/**
 * Uses in ScanEntry
 * @typedef {ScanSymlinkInfo} ScanEntryMeta
 **/
/**
 * Scan error. Scan result representation of `IOError`.
 * @typedef {IOError} ScanError
 **/

/**
 * @typedef {Object} ScanEntryStats
 * @property {number} [size]
 * @property {number} mtime
 */
/**
 * @typedef {Object} ScanEntry
 * @property {string} path
 * @property {ScanEntryType} type
 * @property {ScanError} [error]
 * @property {ScanEntryMeta} [meta]
 * @property {ScanEntryStats} [stats]
 **/

async function statsInfo(entry) {
    try {
        const {
            size,
            mtimeMs
        } = await fs.promises.lstat(entry.path);
        // console.log(entry);
        entry.stats = {
            size,
            mtime: Math.trunc(mtimeMs)
        };
        if (entry.type === "folder") {
            delete entry.stats.size;
        }
    } catch (e) {
        if (entry.error) {
            console.log(ANSI_RED_BOLD("overwrite error")); // error after readlink
        }
        entry.error = e; // todo use array
    }
}
async function linkInfo(entry) {
    if (entry.type !== "symlink") {
        return;
    }
    try {
        const symContent = await fs.promises.readlink(entry.path);
        const linkLocation = path.dirname(entry.path);
        const absolutePathTo = path.resolve(linkLocation, symContent);
        /** @type {ScanSymlinkInfo} */
        entry.meta = {
            pathTo: absolutePathTo,
            content: symContent, // [unused] the orig content of sym link
        }
        console.info(entry.path, ANSI_CYAN("->"), absolutePathTo);
    } catch (e) {
        if (entry.error) {
            console.log(ANSI_RED_BOLD("overwrite error"));
        }
        entry.error = e;
    }
}

/** @param {ListEntry} listEntry */
async function handleListEntry(listEntry) {
    /** @type {ScanEntryType} */
    let type;
    const readdirError = listEntry.error;
    if (!readdirError) {
        type = typeFromDirent(listEntry.dirent);
        meta.increaseTypeCounter(type);
    } else {
        type = "folder";
    }

    /** @type {ScanEntry} */
    const entry = {
        path: listEntry.path,
        error: listEntry.error,
        type
    };

    await linkInfo(entry);
    await statsInfo(entry);

    treeScan.put(entry);

    if (entry.error) {
        meta.errors++;
        console.error(entry.error);
    }
}

const startTime = Date.now();
for await (const /** @type {ListEntry} */ listEntry of listFiles({
    filepath: scanFolderPath,
    recursively: true,
    directories: true
})) {
    await handleListEntry(listEntry);
}
meta.logTable();

/**
 * The scan result as one object.
 * @typedef {ScanFolder} TreeScanResult
 * @property {ScanMeta} meta
 */

/** @type {ScanFolder} */
let result = treeScan.root;
/** @type {TreeScanResult} */
result = {meta, ...result};
const json = JSON.stringify(result/*, null, " "*/)
    .replaceAll(  "\"name\":\"", "\n\"name\":\""); // to simplify parsing for Notepad++

function scanFilename() {
    return [...scanPath, scanDirName]
        .join("/") // no need to use `path.sep`
        .replace("//", "/"); // linux root folder
}

const filename =
    "[.dir-scan]" +
    "[" + scanFilename() + "]" +
    " " + dateToDayDateString(new Date(), false);
const filenameEscaped = filename
    // .replaceAll("/", "⧸")
    // .replaceAll(":", "：")
    // .replaceAll("#", "⋕")
    .replaceAll(/[/:#]/g, "~");
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
    const fullPath = path.join(saveLocation, filenameEscaped + ".json");
    fs.writeFileSync(fullPath, json);
    console.log("Result file:\t", ANSI_GREEN(filenameEscaped + ".json"));
} catch (e) {
    console.log("Write error", e);
    throw e;
}

console.log("Executing time:\t", (Date.now() - startTime)/1000, "seconds");
