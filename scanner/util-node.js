import path from "path";
import fs from "fs/promises";
import * as os from "os";


export * from "../src/util.js";

// ---------------- Common code ----------------- //

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
 * Not follows symlinks
 *
 * @param {object} [settings = {}] - Config object
 * @param {string} [settings.filepath = process.cwd()]
 * @param {boolean} [settings.recursively = true]
 * @param {boolean} [settings.emitDirectories = false]
 * @param {boolean} [settings.onlyFiles = false]
 * @return {AsyncGenerator<PathEntry>}
 */
export async function * listFiles(settings = {}) {
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
        /** @type {fs.Dirent[]} */
        const dirEntries = await fs.readdir(filepath, { // can throws an error
            withFileTypes: true
        });

        for (const dirEntry of dirEntries) {
            const entryFilepath = path.resolve(filepath, dirEntry.name);
            if (!dirEntry.isDirectory()) {
                yield {
                    path: path.resolve(filepath, dirEntry.name),
                    type: Type.of(dirEntry)
                };
            } else {
                if (directories) {
                    yield {
                        path: path.resolve(filepath, dirEntry.name),
                        type: Type.of(dirEntry)
                    }
                }
                if (recursively) {
                    const settingsCopy = JSON.parse(JSON.stringify(settings));
                    Object.assign(settingsCopy, {filepath: entryFilepath});
                    yield * listFiles(settingsCopy);
                }
            }
        }
    } catch (error) {
        yield {
            /** @type {IOError} */
            error,
            path: filepath,
            //type: Type.error,
            type: Type.folder, // since it only readdir may be happened
        }
    }

}



// ------------- More specific code ------------- //
// todo move out

/**
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
 *
 *
 * @typedef {{
 *  errno: number,
 *  code: string,
 *  syscall: string,
 *  path: string
 * }} IOError
 */


/**
 * type (from `Dirent`):
 *  1  —  file (hardlink),
 *  2  —  folder (directory),
 *  3  —  symlink.
 *
 * @readonly
 * @enum {number}
 */
export const Type = {
    file: 1,
    folder: 2,
    symlink: 3,

    error: -1, // dirscan/readlink error
    fifo: 4,
    charDev: 5,
    blockDev: 6,
    socket: 7,
    /**
     * @param {fs.Dirent} dirent
     * @return {number}
     */
    of(dirent) {
        if (dirent.isFile()) {
            return Type.file;
        }
        if (dirent.isDirectory()) {
            return Type.folder;
        }
        if (dirent.isSymbolicLink()) {
            return Type.symlink;
        }
        if (dirent.isFIFO()) {
            return Type.fifo;
        }
        if (dirent.isCharacterDevice()) {
            return Type.charDev;
        }
        if (dirent.isBlockDevice()) {
            return Type.blockDev;
        }
        if (dirent.isSocket()) {
            return Type.socket;
        }
    },
    /** @param {number} number
     *  @return {string}  */
    getTypeString(number) {
        if (number === Type.file) {
            return "file";
        }
        if (number === Type.folder) {
            return "folder";
        }
        if (number === Type.symlink) {
            return "symlink";
        }
        if (number === Type.error) {
            return "error";
        }
        if (number === Type.fifo) {
            return "fifo";
        }
        if (number === Type.charDev) {
            return "charDev";
        }
        if (number === Type.blockDev) {
            return "blockDev";
        }
        if (number === Type.socket) {
            return "socket";
        }
        return "unknown";
    }
};

/**
 * @typedef {{
 *     path: string,
 *     type?: number,
 *     error?: IOError,
 *     symPath?: {pathTo:string}
 * }} PathEntry
 */

export class FilesStructure {
    /**
     * @private
     * @type {Map<string, Object>}
     */
    foldersMap = new Map();

    /** @type {string[]} */
    scanPath;
    /** @type {string} */
    scanDirName;

    /**
     * @param {string} absolutePath
     * @return {{path: string[], name: string}}
     * @private
     */
    _getPathAndName(absolutePath) {
        const fullPath = absolutePath.split(path.sep).filter(e => e);
        this.scanPath = fullPath.slice(0, -1);
        this.scanDirName = fullPath[fullPath.length - 1];
        const startsWithSlash = absolutePath.startsWith("/");
        if (startsWithSlash) { // for linux
            if (!this.scanDirName) {
                this.scanDirName = "/";
            } else {
                this.scanPath.unshift("/");
            }
        }
        return {name: this.scanDirName, path: this.scanPath};
    }

    constructor(scanFolder) {
        const scanFolderAbsolute = path.resolve(scanFolder);
        const {name, path: scanPath} = this._getPathAndName(scanFolderAbsolute);
        const root = {
            name,
            meta: {
                path: scanPath,
                separator: path.sep,
                scanDate: Date.now(),
                platform: os.platform()
            }
        };
        this.foldersMap.set(".", root);
        this.scanFolder = scanFolderAbsolute;
    }

    get scanFilename() {
        return [...this.scanPath, this.scanDirName]
            .join("/") // no need to use `path.sep`
            .replace("//", "/"); // linux root folder
    }

    get value() {
        return this.foldersMap.get(".");
    }

    /**
     * @param {PathEntry} entry
     */
    put(entry) {
        const self = this;
        const relativePath = path.relative(self.scanFolder, entry.path);
        const dirname = path.dirname(relativePath);
        const basename = path.basename(relativePath);


        const parentFolder = takeParentFolder(dirname);
        function takeParentFolder(dirname) {

            function addParentFolder(dirname) {
                const dirName = path.basename(dirname);
                const dirObject = {name: dirName};

                const dirKey = dirname.split(path.sep).slice(0, -1).join(path.sep) || ".";

                let parent = self.foldersMap.get(dirKey);
                if (!parent) {
                    console.log("[no-parent-for]", dirObject.name);
                    parent = addParentFolder(dirKey);
                }
                const folders = parent.folders || (parent.folders = []);
                folders.push(dirObject);
                self.foldersMap.set(dirname, dirObject);

                return dirObject;
            }

            const parentFolder = self.foldersMap.get(dirname);
            if (!parentFolder) {
                return addParentFolder(dirname)
            }
            return parentFolder;
        }

        if (entry.error) {
            if (entry.type === Type.folder) {
                const folder = parentFolder.folders.find(entry => entry.name === basename);
                folder.errors = [];
                folder.errors.push(entry.error);
                return;
            } else if (entry.type === Type.symlink) {
                // no need
            } else {
                console.log("unknown error", entry.error);
                const meta = this.value.meta;
                const unknownErrors = meta.unknownErrors || (meta.unknownErrors = []);
                unknownErrors.push(entry.error);
                return;
            }
        }

        if (entry.type === Type.folder) {
            const folder = {name: basename};
            self.foldersMap.set(relativePath, folder);
            const folders = parentFolder.folders || (parentFolder.folders = []);
            folders.push(folder);
        } else
        if (entry.type === Type.file) {
            const files = parentFolder.files || (parentFolder.files = []);
            files.push(basename);
        } else
        if (entry.type === Type.symlink) {
            const symlinks = parentFolder.symlinks || (parentFolder.symlinks = []);

            const symlink = {
                name: basename
            };
            symlinks.push(symlink);

            if (entry.error) {
                symlink.errors = [entry.error];
            }
            if (entry.symPath && entry.symPath.pathTo) {
                symlink.pathTo = entry.symPath.pathTo;
            }
        } else
        if (entry.type === Type.fifo) {
            const fifos = parentFolder.fifos || (parentFolder.fifos = []);
            fifos.push(basename);
        } else
        if (entry.type === Type.charDev) {
            const charDevs = parentFolder.charDevs || (parentFolder.charDevs = []);
            charDevs.push(basename);
        } else
        if (entry.type === Type.blockDev) {
            const blockDevs = parentFolder.blockDevs || (parentFolder.blockDevs = []);
            blockDevs.push(basename);
        } else
        if (entry.type === Type.socket) {
            const sockets = parentFolder.sockets || (parentFolder.sockets = []);
            sockets.push(basename);
        }

    }

    addMetaObject(meta) {
        Object.assign(this.value.meta, meta);
    }
}

// ---

const _ANSI_RESET = "\u001B[0m";
export const ANSI_BLUE = text => "\u001B[34m" + text + _ANSI_RESET;
