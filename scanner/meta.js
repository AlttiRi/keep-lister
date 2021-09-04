import path from "path";
import os from "os";

/**
 * Scan result representation of Meta class.
 * @typedef {Object} ScanMeta
 * @property {String[]} [path]
 * @property {String} [separator]
 * @property {Number} [scanDate]
 * @property {String} [platform]
 * @property {Number} [files]
 * @property {Number} [folders]
 * @property {Number} [symlinks]
 * @property {Number} [fifos]
 * @property {Number} [charDevs]
 * @property {Number} [blockDevs]
 * @property {Number} [sockets]
 * @property {Number} [unknowns]
 * @property {Number} [total]
 * @property {Number} [errors]
 */


export class Meta {
    /** @param {String[]} scanPath */
    constructor(scanPath) {
        /** @type {String[]} */
        this.path = scanPath;
        /** @type {String} */
        this.separator = path.sep;
        /** @type {Number} */
        this.scanDate = Date.now();
        /** @type {String} */
        this.platform = os.platform();

        this.files = 0;
        this.folders = 0;
        this.symlinks = 0;
        this.errors = 0;

        // For Unix-like OS
        this.fifos = 0;
        this.charDevs = 0;
        this.blockDevs = 0;
        this.sockets = 0;

        this.total = 0;
    }

    /** @param {ScanEntryType} type */
    increaseTypeCounter(type) {
        this[`${type}s`]++;
        this.total++;
    }

    logTable() {
        const {files, folders, symlinks} = this;
        const {total, errors} = this;
        if (this.platform === "win32") {
            console.table({files, folders, symlinks, total, errors});
        } else {
            const {fifos, sockets, charDevs, blockDevs} = this;
            console.table({files, folders, symlinks, fifos, sockets, charDevs, blockDevs, total, errors});
        }
    }
}
