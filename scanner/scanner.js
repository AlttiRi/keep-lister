import path from "path";
import fs from "fs";
import os from "os";
import {listFiles, dateToDayDateString, ANSI_BLUE, exists, ANSI_GREEN} from "./util-node.js";
import {fileURLToPath} from "url";
import {FilesStructure} from "./files-structure.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloads = path.join(os.homedir(), "Downloads");

const scanFolder = path.resolve("./");
console.log("Scanning:", ANSI_GREEN(scanFolder));

const filesStructure = new FilesStructure(scanFolder);

const meta = {
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
for await (const /** @type {ListEntry} */ simpleEntry of listFiles({
    filepath: scanFolder,
    recursively: true,
    directories: true
})) {
    /** @type {EntryType} */
    let type;
    const readdirError = simpleEntry.error;
    if (!readdirError) {
        type = typeFromDirent(simpleEntry.dirent);
        meta[`${type}s`]++;
        meta.total++;
    } else {
        type = "folder";
    }

    /** @type {PathEntry} */
    const entry = {
        ...simpleEntry,
        type
    }

    if (type === "symlink") {
        try {
            const symContent = await fs.promises.readlink(entry.path);
            const absolutePathTo = path.resolve(symContent);
            console.log(entry.path, ANSI_BLUE("->"), absolutePathTo);
            entry.symlinkInfo = {
                pathTo: absolutePathTo
            }
        } catch (e) {
            entry.error = e;
        }
    }

    filesStructure.put(entry);

    if (entry.error) {
        meta.errors++;
        console.log(`"${entry.path}"`, entry.error, entry.path);
    }
}

console.table(meta);
filesStructure.addMetaObject(meta);

/** @type {TreeScanResult} */
const result = filesStructure.root;
const json = JSON.stringify(result/*, null, " "*/)
    .replaceAll(  "\"name\":\"", "\n\"name\":\""); // to simplify parsing for Notepad++

const filename =
    "[.dir-scan]" +
    "[" + filesStructure.scanFilename + "]" +
    " " + dateToDayDateString(new Date(), false);
const filenameEscaped = filename
    // .replaceAll("/", "⧸")
    // .replaceAll(":", "：")
    // .replaceAll("#", "⋕")
    .replaceAll(/[/:#]/g, "~");
try {
    let saveLocation;
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
