import path from "path";


/**
 * @typedef {{
 *  errno: number,
 *  code: string,
 *  syscall: string,
 *  path: string
 * }} IOError
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
 *     type: EntryType,
 *     error: IOError,
 *     [symlinkInfo]: {
 *       pathTo: string,
 *       [content]: string
 *     }
 * }} PathEntry
 */

export class FilesStructure {
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

    /** @param {PathEntry} entry */
    put(entry) {
        const relativePath = path.relative(this.scanFolderAbsolutePath, entry.path);
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
            if (entry.error) { // on readlink
                symlink.errors = [entry.error];
            }
            if (entry.symlinkInfo?.pathTo) {
                symlink.pathTo = entry.symlinkInfo.pathTo;
            }
            symlinks.push(symlink);
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
    }
}
