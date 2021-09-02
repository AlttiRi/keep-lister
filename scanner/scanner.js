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

const startTime = Date.now();
for await (const /** @type {PathEntry} */ entry of listFiles({
    filepath: scanFolder,
    recursively: true,
    directories: true
})) {
    if (!entry.error) { // no readdir error
        meta[`${entry.type}s`]++;
        meta.total++;
    }

    if (entry.type === "symlink") {
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
