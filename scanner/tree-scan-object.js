import path from "path";

/**
 * It's just a filename.
 * @typedef {String} SimpleScanEntry
 */
/**
 * @typedef {Object} ScanStatEntry
 * @property {String} name
 * @property {Number} mtime
 * @property {Number} size
 */
/**
 * @typedef {Object|ScanStatEntry} ScanSymlink
 * @property {String} name
 * @property {String} [pathTo]
 * @property {ScanError[]} [errors]
 */
/**
 * @typedef {Object|ScanStatEntry} ScanFolder
 * @property {String} name
 * @property {ScanFolder[]} [folders]
 * @property {SimpleScanEntry[]} [files]
 * @property {ScanSymlink[]|SimpleScanEntry[]} [symlinks]
 * @property {SimpleScanEntry[]} [fifos]
 * @property {SimpleScanEntry[]} [charDevs]
 * @property {SimpleScanEntry[]} [blockDevs]
 * @property {SimpleScanEntry[]} [sockets]
 * @property {ScanError[]} [errors]
 */

export class TreeScanObject {
    /**
     * @param {Object} init
     * @param {String} init.scanDirName
     * @param {String} init.scanFolderAbsolutePath
     */
    constructor({scanDirName, scanFolderAbsolutePath}) {
        /** @type {ScanFolder} */
        this.root = {
            name: scanDirName
        };

        /** @type {Map<string, ScanFolder>} */
        this.foldersMap = new Map();
        this.foldersMap.set(".", this.root);

        /** @type {string} */
        this.scanFolderAbsolutePath = scanFolderAbsolutePath;
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

        /** @type {ScanFolder} */
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

    /** @param {ScanEntry} entry */
    put(entry) {
        const relativePath = path.relative(this.scanFolderAbsolutePath, entry.path);
        const relativeDirname = path.dirname(relativePath); // "." for files in the scan folder
        const basename = path.basename(relativePath);

        /** @type {ScanFolder} */
        const parentFolder = this.takeFolder(relativeDirname);

        const base = {
            name: basename,
            ...entry.stats
        };

        if (entry.type === "folder") {
            if (entry.error) { // on readdir
                const folder = parentFolder.folders.find(entry => entry.name === basename);
                const folderErrors = folder.errors || (folder.errors = []);
                folderErrors.push(entry.error);
                return;
            }
            /** @type {ScanFolder} */
            const folder = base;
            this.foldersMap.set(relativePath, folder);
            const folders = parentFolder.folders || (parentFolder.folders = []);
            folders.push(folder);
            return;
        }

        if (entry.type === "symlink") {
            const symlinks = parentFolder.symlinks || (parentFolder.symlinks = []);

            /** @type {ScanSymlink} */
            const symlink = base;
            if (entry.stats) {
                symlink.size = entry.stats.size;
            }
            if (entry.error) { // on readlink
                symlink.errors = [entry.error];
            }
            if (entry.meta?.pathTo) {
                symlink.pathTo = entry.meta.pathTo;
            }
            symlinks.push(symlink);
            return;
        }

        if (entry.type === "file") {
            const files = parentFolder.files || (parentFolder.files = []);
            files.push(base);
        } else
        if (entry.type === "fifo") {
            const fifos = parentFolder.fifos || (parentFolder.fifos = []);
            fifos.push(base);
        } else
        if (entry.type === "charDev") {
            const charDevs = parentFolder.charDevs || (parentFolder.charDevs = []);
            charDevs.push(base);
        } else
        if (entry.type === "blockDev") {
            const blockDevs = parentFolder.blockDevs || (parentFolder.blockDevs = []);
            blockDevs.push(base);
        } else
        if (entry.type === "socket") {
            const sockets = parentFolder.sockets || (parentFolder.sockets = []);
            sockets.push(base);
        }
    }
}
