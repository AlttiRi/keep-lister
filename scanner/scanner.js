//#!/usr/bin/env node

import path from "path";
import fs from "fs";
import os from "os";
import {Type, listFiles, FilesStructure, dateToDayDateString, ANSI_BLUE, exists, ANSI_GREEN} from "./util-node.js";
import {fileURLToPath} from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloads = path.join(os.homedir(), "Downloads");

const scanFolder = path.resolve("./");
console.log("[scanFolder]", scanFolder);

const filesStructure = new FilesStructure(scanFolder);

// const logFile = fs.createWriteStream(path.join(downloads, "lines.txt"));

const startTime = Date.now();

const report = {
    files: 0,
    folders: 0,
    symlinks: 0,
    errors: 0,

    // linux
    fifos: 0,
    charDevs: 0,
    blockDevs: 0,
    sockets: 0,

    unknowns: 0,
};

let i = 0;
for await (const entry of listFiles({
    filepath: scanFolder,
    recursively: true,
    directories: true
})) {
    i++;

    if (!entry.error) { // currently only on dirread
        report[`${Type.getTypeString(entry.type)}s`]++;
    }

    if (entry.type === Type.symlink) {
        try {
            const symContent = await fs.promises.readlink(entry.path);
            const absolute = path.resolve(symContent);
            console.log(entry.path, ANSI_BLUE("->"), absolute);
            entry.symPath = {
                pathTo: absolute
            }
        } catch (e) {
            entry.error = e;
        }
    }

    filesStructure.put(entry);

    if (entry.error)  {
        report.errors++;
        console.log(`"${entry.path}"`, entry.error, entry.path);
    }
    // const lineText = entry.path + (entry.type === Type.folder ? path.sep : "");
    // logFile.write(lineText + "\n");
}

const total = report.files + report.folders + report.symlinks;
const meta = {
    ...report,
    total
};
console.log("----");
console.table(meta);
filesStructure.addMetaObject(meta);


const json = JSON.stringify(filesStructure.value/*, null, " "*/)
    .replaceAll(  "\"name\":\"", "\n\"name\":\""); // to simplify Notepad++ parsing

const filename =
    "[.dir-scan]" +
    "[" + filesStructure.scanFilename + "]" +
    " " + dateToDayDateString(new Date(), false);
const filenameEscaped = filename
    .replaceAll("/", "⧸")
    .replaceAll(":", "：")
    .replaceAll("#", "⋕");
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

console.table({"item count": i, "seconds": (Date.now() - startTime)/1000});


