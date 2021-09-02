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
 * @typedef {{
 *     path: string,
 *     dirent?: import("fs/promises").Dirent,
 *     error?: IOError
 * }} ListEntry
 */

/**
 * Not follows symlinks
 * May return an entry with readdir error (entry type is folder)
 *
 * @param {object} [settings = {}] - Config object
 * @param {string} [settings.filepath = process.cwd()]
 * @param {boolean} [settings.recursively = true]
 * @param {boolean} [settings.emitDirectories = false]
 * @param {boolean} [settings.onlyFiles = false]
 * @return {AsyncGenerator<ListEntry>}
 */
export async function *listFiles(settings = {}) {
    const {
        filepath,
        recursively,
        // followSymbol, // [unused] // if loop? // if other hard drive? //
        directories,
    } = Object.assign({
        filepath: process.cwd(),
        recursively: true,
        // followSymbol: false,
        directories: false,
    }, settings);

    try {
        /** @type {import("fs/promises").Dirent[]} */
        const dirEntries = await fs.readdir(filepath, { // can throws an error
            withFileTypes: true
        });

        for (const dirEntry of dirEntries) {
            const entryFilepath = path.resolve(filepath, dirEntry.name);
            if (!dirEntry.isDirectory()) {
                yield {
                    path: entryFilepath,
                    dirent: dirEntry
                };
            } else {
                if (directories) {
                    yield {
                        path: entryFilepath,
                        dirent: dirEntry
                    }
                }
                if (recursively) {
                    yield *listFiles({...settings, filepath: entryFilepath});
                }
            }
        }
    } catch (error) {
        yield {
            /** @type {IOError} */
            error,
            path: filepath
        }
    }
}

const _ANSI_RESET = "\u001B[0m";
export const ANSI_BLUE = text => "\u001B[34m" + text + _ANSI_RESET;
export const ANSI_GREEN = text => "\u001B[32m" + text + _ANSI_RESET;
