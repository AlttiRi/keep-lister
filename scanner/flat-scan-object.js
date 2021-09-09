import path from "path";

/**
 * @typedef {Object} SerializableScanEntry
 * @property {String} name
 * @property {ScanEntryType} type
 *
 * @property {Number} [id]
 * @property {Number|null} pid
 *
 * @property {ScanError[]} [errors]
 *
 * @property {String} [pathTo]
 * @property {String} [content]
 *
 * @property {number} [mtime]
 * @property {number} [btime]
 * @property {number} [size]
 *
 **/

export class FlatScanObject {
    id = 0;
    /** @type {SerializableScanEntry[]} */
    values = [];
    /** rel path to folder
     * @type {Map<String, SerializableScanEntry>} */
    foldersMap = new Map();

    /** @type {ScanEntry} */
    constructor(rootEntry, name) {
        this.rootPath = rootEntry.path;

        const sEntry = this.createSerializableEntry(rootEntry);
        sEntry.name = name;
        sEntry.pid = null;
        this.foldersMap.set(".", sEntry)
        this.values.push(sEntry);
    }

    /** @param {ScanEntry} entry */
    add(entry) {
        const {relativePath} = this.parsePath(entry);
        if (entry.error) { // `readdir` error (scandir)
            const sEntry = this.foldersMap.get(relativePath);
            (sEntry.errors || (sEntry.errors = [])).push(entry.error);
            return sEntry;
        }

        const sEntry = this.createSerializableEntry(entry);
        if (sEntry.type === "folder") {
            this.foldersMap.set(relativePath, sEntry);
        }
        this.values.push(sEntry);
        return sEntry;
    }

    /**
     * @param {ScanEntry} entry
     * @return {{relativeDirname: string, parentFolder: SerializableScanEntry, relativePath: string, name: string}}
     */
    parsePath(entry) {
        const relativePath = path.relative(this.rootPath, entry.path);
        const relativeDirname = path.dirname(relativePath); // "." for files in the scan folder
        const name = path.basename(relativePath);
        /** @type {SerializableScanEntry} */
        const parentFolder = this.foldersMap.get(relativeDirname);
        return {name, relativePath, relativeDirname, parentFolder};
    }

    /** @param {ScanEntry} entry
     *  @return {SerializableScanEntry} */
    createSerializableEntry(entry) {
        const {
            type,
            statsInfo,
            linkInfo,
        } = entry;
        const {parentFolder, name} = this.parsePath(entry);

        /** @type {SerializableScanEntry} */
        const sEntry = {
            type,
            name,
            pid: parentFolder?.id, // undefined only for root
        }

        if (sEntry.type === "folder") {
            sEntry.id = this.id++;
        }

        if (statsInfo) {
            if (statsInfo.error) {
                sEntry.errors = [statsInfo.error];
            } else {
                /**@type {import("fs").Stats} */
                const stats = statsInfo.stats;

                sEntry.mtime = Math.trunc(stats.mtimeMs);
                sEntry.btime = Math.trunc(stats.birthtimeMs);
                if (stats.size) { // do not store size for folders and empty files
                    sEntry.size = stats.size;
                }
            }
        }

        if (linkInfo) {
            if (linkInfo.error) {
                (sEntry.errors || (sEntry.errors = [])).push(linkInfo.error);
            } else {
                sEntry.pathTo = linkInfo.pathTo;
                sEntry.content = linkInfo.content;
            }
        }

        return sEntry;
    }

}
