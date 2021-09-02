import path from "path";
import fs from "fs";
import os from "os";
import {listFiles, dateToDayDateString, ANSI_BLUE, exists, ANSI_GREEN} from "./util-node.js";
import {fileURLToPath} from "url";
import {FilesStructure} from "./files-structure.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const scanFolder = ".";
const scanFolderAbsolutePath = path.resolve(scanFolder);
console.log("Scanning:", ANSI_GREEN(scanFolderAbsolutePath));


const {scanPath, scanDirName} = getPathAndName(scanFolderAbsolutePath);
const filesStructure = new FilesStructure({
    scanFolderAbsolutePath,
    scanDirName
});

/** @type {Meta} */
const meta = {
    path: scanPath,
    separator: path.sep,
    scanDate: Date.now(),
    platform: os.platform(),

    files: 0,
    folders: 0,
    symlinks: 0,
    errors: 0,

    // unix-like
    fifos: 0,
    charDevs: 0,
    blockDevs: 0,
    sockets: 0,

    total: 0,
};

/**
 * @param {string} absolutePath
 * @return {{scanPath: string[], scanDirName: string}}
 */
function getPathAndName(absolutePath) {
    const fullPath = absolutePath.split(path.sep).filter(e => e);
    /** @type {string[]} */
    const scanPath = fullPath.slice(0, -1);
    /** @type {string} */
    let scanDirName = fullPath[fullPath.length - 1];
    const startsWithSlash = absolutePath.startsWith("/");
    if (startsWithSlash) { // for linux
        if (!scanDirName) {
            scanDirName = "/";
        } else {
            scanPath.unshift("/");
        }
    }
    return {scanDirName, scanPath};
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
 * } EntryType
 */

/**
 * @param {import("fs/promises").Dirent} dirent
 * @return {EntryType}
 */
export function typeFromDirent(dirent) {
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


const startTime = Date.now();
for await (const /** @type {ListEntry} */ listEntry of listFiles({
    filepath: scanFolder,
    recursively: true,
    directories: true
})) {
    /** @type {EntryType} */
    let type;
    const readdirError = listEntry.error;
    if (!readdirError) {
        type = typeFromDirent(listEntry.dirent);
        meta[`${type}s`]++;
        meta.total++;
    } else {
        type = "folder";
    }

    /** @type {PathEntry} */
    const entry = {
        ...listEntry,
        type
    };

    if (type === "symlink") {
        try {
            const symContent = await fs.promises.readlink(entry.path);
            const absolutePathTo = path.resolve(entry.path, symContent);
            entry.symlinkInfo = {
                pathTo: absolutePathTo,
                content: symContent, // [unused] the orig content of sym link
            }
            console.info(entry.path, ANSI_BLUE("->"), absolutePathTo);
        } catch (e) {
            entry.error = e;
        }
    }

    filesStructure.put(entry);

    if (entry.error) {
        meta.errors++;
        console.error(entry.error);
    }
}
const {files, folders, symlinks} = meta;
const {fifos, sockets, charDevs, blockDevs} = meta;
const {total, errors} = meta;
console.table({files, folders, symlinks, fifos, sockets, charDevs, blockDevs, total, errors});

/** @type {ScanFolder} */
let result = filesStructure.root;
/** @type {TreeScanResult} */
result = {...result, meta};
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
