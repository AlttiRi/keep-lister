import path from "path";
import fs from "fs/promises";

export * from "../src/util.js";


export function exists(path, followSymbol = true) {
    return (followSymbol ? fs.stat(path) : fs.lstat(path))
        .then(stats => true)
        .catch(error => false);
}

/**
 * Is the passed sym link looped — if referrers to a parent directory.
 * @param {string} filepath
 * @return {Promise<boolean>}
 */
export async function isSymLooped(filepath) {
    const filepathAbsolute = path.resolve(filepath);
    const dirname = path.dirname(filepathAbsolute);
    const linkPath = await fs.readlink(filepathAbsolute); // can be "."
    const linkPathAbsolute = path.resolve(dirname, linkPath);
    return linkPathAbsolute.includes(dirname);
}

/**
 * The error object that happens while scanning.
 * @typedef {Object} IOError
 * @property {String} syscall - "scandir", "readlink", ...
 * @property {String} code    - "EPERM", ...
 * @property {Number} errno   - "-4048", ...
 * @property {String} path    - "C:\System Volume Information", ...
 *
 * @example
 * [Error: EPERM: operation not permitted, scandir "C:\\$Recycle.Bin\\S-1-5-18"] {
 *  errno: -4048,
 *  code: "EPERM",
 *  syscall: "scandir",
 *  path: "C:\\$Recycle.Bin\\S-1-5-18"
 * }
 *
 * [Error: EACCES: permission denied, scandir '/boot/efi'] {
 *  errno: -13,
 *  code: 'EACCES',
 *  syscall: 'scandir',
 *  path: '/boot/efi'
 *}
 */

/**
 * An entry of the listing of the content of a directory.
 * @typedef {Object} ListEntry
 * @property {String} path
 * @property {import("fs/promises").Dirent} [dirent]
 * @property {IOError} [error]
 */

/**
 * An entry of the listing of the content of a directory.
 * @typedef {Object} FileListingSetting
 * @property {string}  [filepath = process.cwd()]
 * @property {boolean} [recursively = true]
 * @property {boolean} [emitDirectories = false]
 * @property {boolean} [breadthFirst = false]
 * @property {boolean} [depthBreadthRoot = false] - to list at the start all entries of the root folder.
 * @property {Number}  [_deep = 0]
 */

/** @type {FileListingSetting} */
const defaultFileListingSetting = {
    filepath: process.cwd(),
    recursively: true,
    // followSymbol: false,  // [unused] // if loop? // if other hard drive? //
    emitDirectories: false,
    breadthFirst: false,
    depthBreadthRoot: false,
    _deep: 0,
};

/**
 * Not follows symlinks
 * May return an entry with readdir error (entry type is folder)
 *
 * @param {FileListingSetting} [settings = {}] - Config object
 * @return {AsyncGenerator<ListEntry>}
 */
export async function *listFiles(settings = {}) {
    settings = Object.assign(defaultFileListingSetting, settings);
    // console.log(settings._deep, settings.filepath);

    try {
        /** @type {import("fs/promises").Dirent[]} */
        const dirEntries = await fs.readdir(settings.filepath, { // can throws an error
            withFileTypes: true
        });
        /** @type {ListEntry[]} */
        const listEntries = dirEntries.map(dirEntry => toListEntry(dirEntry, settings));
        if (!settings.breadthFirst) {
            if (settings.depthBreadthRoot && settings._deep === 0) {
                yield *depthBreadthFirstList(settings, listEntries);
            } else {
                yield *depthFirstList(settings, listEntries);
            }
        } else {
            yield *breadthFirstList(settings, listEntries);
        }
    } catch (error) {
        yield {
            /** @type {IOError} */
            error, // `readdir()` error (`scandir` call)
            path: settings.filepath
        }
    }
}

/**
 * @param {FileListingSetting} settings
 * @param {import("fs/promises").Dirent} dirEntry
 * @return {ListEntry}
 */
function toListEntry(dirEntry, settings) {
    const entryFilepath = path.resolve(settings.filepath, dirEntry.name);
    /** @type {ListEntry} */
    return {
        path: entryFilepath,
        dirent: dirEntry
    };
}

/**
 * @param {FileListingSetting} settings
 * @param {ListEntry[]} listEntries
 * @return {AsyncGenerator<ListEntry>}
 */
async function *depthFirstList(settings, listEntries) {
    for (const listEntry of listEntries) {
        if (!listEntry.dirent.isDirectory()) {
            yield listEntry;
        } else {
            if (settings.emitDirectories) {
                yield listEntry;
            }
            if (settings.recursively) {
                const _deep = settings._deep + 1;
                yield *listFiles({...settings, _deep, filepath: listEntry.path});
            }
        }
    }
}

/**
 * Yields all directory's entries and only then goes to deep.
 * @param {FileListingSetting} settings
 * @param {ListEntry[]} listEntries
 * @return {AsyncGenerator<ListEntry>}
 */
async function *depthBreadthFirstList(settings, listEntries) {
    /** @type {ListEntry[]} */
    let queue = [];
    const _deep = settings._deep + 1;
    for (const listEntry of listEntries) {
        if (!listEntry.dirent.isDirectory()) {
            yield listEntry;
        } else {
            if (settings.emitDirectories) {
                yield listEntry;
            }
            if (settings.recursively) {
                queue.push(listEntry);
            }
        }
    }
    for (const listEntry of queue) {
        yield *listFiles({...settings, _deep, filepath: listEntry.path});
    }
}


/**
 * @param {FileListingSetting} settings
 * @param {ListEntry[]} listEntries
 * @return {AsyncGenerator<ListEntry>}
 */
async function *breadthFirstList(settings, listEntries) {
    /** @type {ListEntry[]} */
    let queue = [];
    let _deep = settings._deep;

    for (const listEntry of listEntries) {
        if (listEntry.dirent.isDirectory()) {
            if (settings.recursively) {
                queue.push(listEntry);
            }
            if (settings.emitDirectories) {
                yield listEntry;
            }
        } else {
            yield listEntry;
        }
    }

    while (queue.length) {
        _deep++;
        queue = yield *list(queue, _deep);
    }

    async function *list(queue, _deep) {
        /** @type {ListEntry[]} */
        const nextLevelQueue = [];
        /** @type {ListEntry|undefined} */
        let entry;
        while (entry = queue.shift()) {
            for await (const listEntry of listFiles({
                ...settings,
                filepath: entry.path,
                recursively: false,
                _deep
            })) {
                if (listEntry.error) {
                    yield listEntry;
                    continue;
                }
                if (listEntry.dirent.isDirectory()) {
                    if (settings.emitDirectories) {
                        yield listEntry;
                    }
                    nextLevelQueue.push(listEntry);
                } else {
                    yield listEntry;
                }
            }
        }
        return nextLevelQueue;
    }
}


const _ANSI_RESET = "\u001B[0m";
export const ANSI_BLUE = text => "\u001B[34m" + text + _ANSI_RESET;
export const ANSI_CYAN = text => "\u001B[36m" + text + _ANSI_RESET;
export const ANSI_GREEN = text => "\u001B[32m" + text + _ANSI_RESET;
export const ANSI_GREEN_BOLD = text => "\u001B[1;32m" + text + _ANSI_RESET;
export const ANSI_RED_BOLD = text => "\u001B[1;31m" + text + _ANSI_RESET;
