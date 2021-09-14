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
 * Not follows symlinks
 * May return an entry with readdir error (entry type is folder)
 *
 * @param {object} [settings = {}] - Config object
 * @param {string} [settings.filepath = process.cwd()]
 * @param {boolean} [settings.recursively = true]
 * @param {boolean} [settings.emitDirectories = false]
 * @param {boolean} [breadthFirst = false]
 * @return {AsyncGenerator<ListEntry>}
 */
export async function *listFiles(settings = {}, breadthFirst = false) {
    Object.assign({
        filepath: process.cwd(),
        recursively: true,
        // followSymbol: false,  // [unused] // if loop? // if other hard drive? //
        emitDirectories: false,
    }, settings);

    try {
        /** @type {import("fs/promises").Dirent[]} */
        const dirEntries = await fs.readdir(settings.filepath, { // can throws an error
            withFileTypes: true
        });
        if (!breadthFirst) {
            yield *depthFirstList(settings, dirEntries);
        } else {
            yield *breadthFirstList(settings, dirEntries);
        }
    } catch (error) {
        yield {
            /** @type {IOError} */
            error, // `readdir()` error (`scandir` call)
            path: filepath
        }
    }
}

/**
 * @param {object} [settings = {}] - Config object
 * @param {string} [settings.filepath = process.cwd()]
 * @param {boolean} [settings.recursively = true]
 * @param {boolean} [settings.emitDirectories = false]
 * @param {import("fs/promises").Dirent[]} dirEntries
 * @return {AsyncGenerator<ListEntry>}
 */
async function *depthFirstList(settings, dirEntries) {
    for (const dirEntry of dirEntries) {
        const entryFilepath = path.resolve(settings.filepath, dirEntry.name);
        /** @type {ListEntry} */
        const listEntry = {
            path: entryFilepath,
            dirent: dirEntry
        };
        if (!dirEntry.isDirectory()) {
            yield listEntry;
        } else {
            if (settings.emitDirectories) {
                yield listEntry;
            }
            if (settings.recursively) {
                yield *listFiles({...settings, filepath: entryFilepath});
            }
        }
    }
}

/**
 * @param {object} [settings = {}] - Config object
 * @param {string} [settings.filepath = process.cwd()]
 * @param {boolean} [settings.recursively = true]
 * @param {boolean} [settings.emitDirectories = false]
 * @param {import("fs/promises").Dirent[]} dirEntries
 * @return {AsyncGenerator<ListEntry>}
 */
async function *breadthFirstList(settings, dirEntries) {
    /** @type {ListEntry[]} */
    const queue = [];
    for (const dirEntry of dirEntries) {
        const entryFilepath = path.resolve(settings.filepath, dirEntry.name);
        const listEntry = {
            path: entryFilepath,
            dirent: dirEntry
        };
        if (dirEntry.isDirectory()) {
            queue.push(listEntry);
            if (settings.emitDirectories) {
                yield listEntry;
            }
        } else {
            yield listEntry;
        }
    }
    /** @type {ListEntry|undefined} */
    let entry;
    while (entry = queue.shift()) {
        for await (const listEntry of listFiles({
            ...settings,
            filepath: entry.path,
            recursively: false,
        })) {
            if (listEntry.error) {
                yield listEntry;
                continue;
            }
            if (listEntry.dirent.isDirectory()) {
                if (settings.emitDirectories) {
                    yield listEntry;
                }
                queue.push(listEntry);
            } else {
                yield listEntry;
            }
        }
    }
}


const _ANSI_RESET = "\u001B[0m";
export const ANSI_BLUE = text => "\u001B[34m" + text + _ANSI_RESET;
export const ANSI_CYAN = text => "\u001B[36m" + text + _ANSI_RESET;
export const ANSI_GREEN = text => "\u001B[32m" + text + _ANSI_RESET;
export const ANSI_GREEN_BOLD = text => "\u001B[1;32m" + text + _ANSI_RESET;
export const ANSI_RED_BOLD = text => "\u001B[1;31m" + text + _ANSI_RESET;
