import path from "path";

/**
 * @typedef {Object} SerializableScanEntry
 * @property {String} name
 * @property {ScanEntryType} type
 *
 * @property {Number|String} [id] - only for folders
 * @property {String} [hid] - "uniqueID:hardlinksCount" (some hardlinks can be out of the scan)
 * @property {Number|null|String} pid - parent's ID
 *
 * @property {Number[]} [errors] - error IDs
 *
 * @property {String} [pathTo] - absolute path where the link goes
 * @property {String} [content] - the original text content
 *
 * @property {number} [mtime] - modification time
 * @property {number} [btime] - creation time (crtime)
 * @property {number} [size]
 *
 **/

export class FlatScanObject {
    /* Incremental IDs used in entries */
    id = 0;
    hid = 0; // hardlink id
    eid = 0; // error id

    /** @type {SerializableScanEntry[]} */
    values = [];
    /** rel path to folder
     * @type {Map<String, SerializableScanEntry>} */
    foldersMap = new Map();
    /** "dev:inode" to "hid:nlink"
     * @type {Map<String, String>} */
    hardlinkMap = new Map();
    /** "code:syscall:errno" to id
     * @type {Map<String, Number>} */
    errorsMap = new Map();

    /** @type {ScanEntry} */
    constructor(rootEntry, name) {
        this.rootPath = rootEntry.path;

        const sEntry = this.createSerializableEntry(rootEntry);
        sEntry.name = name;
        sEntry.pid = null;
        this.foldersMap.set(".", sEntry)
        this.values.push(sEntry);
    }

    /**
     * @param {SerializableScanEntry} sEntry
     * @param {ScanError} error
     */
    insertError(sEntry, error) {
        const key = `${error.code}:${error.syscall}:${error.errno}`;

        if (!this.errorsMap.has(key)) {
            const eid = this.eid++;
            this.errorsMap.set(key, eid);
        }
        const eid = this.errorsMap.get(key);

        (sEntry.errors || (sEntry.errors = [])).push(eid);
    }

    /** @param {ScanEntry} entry */
    add(entry) {
        const {relativePath} = this.parsePath(entry);
        if (entry.error) { // `readdir` error (scandir)
            const sEntry = this.foldersMap.get(relativePath);
            this.insertError(sEntry, entry.error);
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
                this.insertError(sEntry, statsInfo.error);
            } else {
                /**@type {import("fs").Stats} */
                const stats = statsInfo.stats;

                sEntry.mtime = Math.trunc(stats.mtimeMs);
                sEntry.btime = Math.trunc(stats.birthtimeMs);
                if (stats.size) { // do not store size for folders and empty files
                    sEntry.size = stats.size;
                }
                if (stats.nlink > 1) {
                    const key = `${stats.dev}:${stats.ino}`;
                    if (!this.hardlinkMap.has(key)) {
                        const hid = `${this.hid++}:${stats.nlink}`;
                        this.hardlinkMap.set(key, hid);
                    }
                    const hid = this.hardlinkMap.get(key);
                    sEntry.hid = hid;

                    // linux madness debug
                    const nLinks = Number(hid.split(":")[1]); // at the first time
                    if (nLinks !== stats.nlink) {
                        console.log(`[nlink-count]:`, stats.nlink, entry.path);
                    }
                }
            }
        }

        if (linkInfo) {
            if (linkInfo.error) {
                this.insertError(sEntry, linkInfo.error);
            } else {
                sEntry.pathTo = linkInfo.pathTo;
                sEntry.content = linkInfo.content;
            }
        }

        return sEntry;
    }

}
