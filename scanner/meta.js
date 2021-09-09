import path from "path";
import os from "os";

/**
 * Scan result representation of Meta class.
 * @typedef {Object} ScanMeta
 * @property {String[]} path
 * @property {String} separator
 * @property {String} scanDate
 * @property {String} platform
 * @property {Number} files
 * @property {Number} folders
 * @property {Number} symlinks
 * @property {Number} fifos
 * @property {Number} charDevs
 * @property {Number} blockDevs
 * @property {Number} sockets
 * @property {Number} total
 * @property {Number} errors
 * @property {Number} mHardLinks
 * @property {Number} mHardLinksTotal
 */


export class Meta {
    /** inode to count
     * @type {Map<Number, Number>} */
    hardlinkMap = new Map();

    /** @param {String[]} scanPath */
    constructor(scanPath) {
        /** @type {String[]} */
        this.path = scanPath;
        /** @type {String} */
        this.separator = path.sep;
        /** @type {String} */
        this.scanDate = new Date().toISOString();
        /** @type {String} */
        this.platform = os.platform();

        this.files = 0;
        this.folders = 0;
        this.symlinks = 0;

        // For Unix-like OS
        this.fifos = 0;
        this.charDevs = 0;
        this.blockDevs = 0;
        this.sockets = 0;

        this.total = 0;
        this.errors = 0;

        /** @type {number} */
        this.mHardLinks = 0;      // count of unique files with nlink > 1
        /** @type {number} */
        this.mHardLinksTotal = 0; //  total count of files with nlink > 1
    }

    finalizeHardlinkInfo() {
        const inodeCount = this.hardlinkMap.size;
        if (inodeCount) {
            /** @type {number} */
            let hardlinks = 0;
            for (const [inode, count] of this.hardlinkMap.entries()) {
                hardlinks += count;
            }
            this.mHardLinks = inodeCount;
            this.mHardLinksTotal = hardlinks;
        }
        delete this.hardlinkMap;
    }

    /** @param {ScanEntry} scanEntry */
    handleStats(scanEntry) {
        if (scanEntry.statsInfo?.stats) {
            const {stats} = scanEntry.statsInfo;
            if (stats.nlink > 1) {
                const count = this.hardlinkMap.get(stats.ino) || 0;
                this.hardlinkMap.set(stats.ino, count + 1);
            }
        }
    }

    /** @param {ScanEntryType} type */
    increaseTypeCounter(type) {
        this[`${type}s`]++;
        this.total++;
    }

    /** @param {ScanEntry} scanEntry */
    increaseErrorCounter(scanEntry) {
        this.errors += [scanEntry.error, scanEntry.linkInfo?.error, scanEntry.statsInfo?.error].filter(e => e).length;
    }

    /*
     *--- Converts multiline JSON array:
     * "path": [
     *  "C:",
     *  "Downloads"
     * ],
     *--- to one line:
     * "path": ["C:", "Downloads"],
     *---
     */
    toFormattedJSON() {
        return JSON.stringify(this, null, " ")
            .replace("[\n  ", "[")
            .replaceAll(",\n  ", ", ")
            .replace("\n ],", "],");
    }

    logTable() {
        const {files, folders, symlinks} = this;
        const {total, errors} = this;
        const {mHardLinksTotal, mHardLinks} = this;
        const mHardlinks = `${mHardLinksTotal}(${mHardLinks})`;
        if (this.platform === "win32") {
            console.table({files, folders, symlinks, total, errors, mHardlinks});
        } else {
            const {fifos, sockets, charDevs, blockDevs} = this;
            console.table({files, folders, symlinks, fifos, sockets, charDevs, blockDevs, total, errors, mHardlinks});
        }
    }
}
