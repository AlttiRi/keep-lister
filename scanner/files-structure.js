import path from "path";
import os from "os";


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
 * @typedef {{
 *  errno: number,
 *  code: string,
 *  syscall: string,
 *  path: string
 * }} IOError
 */
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
 * @typedef {{
 *     path: string,
 *     type?: EntryType,
 *     error?: IOError,
 *     symlinkInfo?: {pathTo:string}
 * }} PathEntry
 */

const separator = path.sep;

export class FilesStructure {
    /**
     * @type {Map<string, TreeScanResult|ScanFolder>}
     * @private */
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
    getPathAndName(absolutePath) {
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

    /** @param {String} scanFolderPath */
    constructor(scanFolderPath) {
        const scanFolderAbsolutePath = path.resolve(scanFolderPath);
        const {name, path: scanPath} = this.getPathAndName(scanFolderAbsolutePath);

        /** @type {TreeScanResult} */
        const root = {
            name,
            meta: {
                path: scanPath,
                separator,
                scanDate: Date.now(),
                platform: os.platform()
            }
        };
        this.foldersMap.set(".", root);
        /**
         * Absolute path of the scan root
         * @type {string} */
        this.scanFolder = scanFolderAbsolutePath;
    }

    get scanFilename() {
        return [...this.scanPath, this.scanDirName]
            .join("/") // no need to use `path.sep`
            .replace("//", "/"); // linux root folder
    }

    /** @return {TreeScanResult} */
    get root() {
        return this.foldersMap.get(".");
    }

    /**
     * @param {String} relativeDirname
     * @return {ScanFolder}
     * @private */
    addFolder(relativeDirname) {
        const dirName = path.basename(relativeDirname);
        /** @type {ScanFolder} */
        const dirObject = {name: dirName};
        /** @type {string} */
        const dirKey = relativeDirname.split(path.sep).slice(0, -1).join(path.sep) || ".";

        /** @type {TreeScanResult | ScanFolder} */
        let parent = this.foldersMap.get(dirKey);
        if (!parent) {
            parent = this.addFolder(dirKey);
        }
        const folders = parent.folders || (parent.folders = []);
        folders.push(dirObject);
        this.foldersMap.set(relativeDirname, dirObject);

        return dirObject;
    }

    /**
     * @param {String} relativeDirname
     * @return {ScanFolder}
     * @private */
    takeFolder(relativeDirname) {
        const folder = this.foldersMap.get(relativeDirname);
        if (!folder) { // Looks unnecessary, since the scanning is sequential.
            return this.addFolder(relativeDirname);
        }
        return folder;
    }

    /** @param {PathEntry} entry */
    put(entry) {
        const relativePath = path.relative(this.scanFolder, entry.path);
        const relativeDirname = path.dirname(relativePath); // "." for files in the scan folder
        const basename = path.basename(relativePath);

        /** @type {ScanFolder} */
        const parentFolder = this.takeFolder(relativeDirname);

        if (entry.type === "folder") {
            if (entry.error) { // on readdir
                const folder = parentFolder.folders.find(entry => entry.name === basename);
                const folderErrors = folder.errors || (folder.errors = []);
                folderErrors.push(entry.error);
                return;
            }
            /** @type {ScanFolder} */
            const folder = {name: basename};
            this.foldersMap.set(relativePath, folder);
            const folders = parentFolder.folders || (parentFolder.folders = []);
            folders.push(folder);
        } else
        if (entry.type === "file") {
            const files = parentFolder.files || (parentFolder.files = []);
            files.push(basename);
        } else
        if (entry.type === "symlink") {
            const symlinks = parentFolder.symlinks || (parentFolder.symlinks = []);

            /** @type {ScanSymlink} */
            const symlink = {
                name: basename
            };
            symlinks.push(symlink);

            if (entry.error) {
                symlink.errors = [entry.error];
            }
            if (entry.symlinkInfo?.pathTo) {
                symlink.pathTo = entry.symlinkInfo.pathTo;
            }
        } else
        if (entry.type === "fifo") {
            const fifos = parentFolder.fifos || (parentFolder.fifos = []);
            fifos.push(basename);
        } else
        if (entry.type === "charDev") {
            const charDevs = parentFolder.charDevs || (parentFolder.charDevs = []);
            charDevs.push(basename);
        } else
        if (entry.type === "blockDev") {
            const blockDevs = parentFolder.blockDevs || (parentFolder.blockDevs = []);
            blockDevs.push(basename);
        } else
        if (entry.type === "socket") {
            const sockets = parentFolder.sockets || (parentFolder.sockets = []);
            sockets.push(basename);
        }

        if (entry.error && !["folder", "symlink"].includes(entry.type)) {
            console.log("unknown error", entry.error);
            const meta = this.root.meta;
            const unknownErrors = meta.unknownErrors || (meta.unknownErrors = []);
            unknownErrors.push(entry.error);
        }
    }

    addMetaObject(meta) {
        Object.assign(this.root.meta, meta);
    }
}
