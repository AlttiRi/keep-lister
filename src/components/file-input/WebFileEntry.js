export class WebFileEntry {
    /**
     * @param {Object} init
     * @param {File} [init.file]
     * @param {"file"|"folder"} init.type
     * @param {WebFileEntry} [init.parent]
     * @param {String} [init.name]
     */
    constructor({file, parent, type, name}) {
        if (file) {
            /** @type {File|undefined} */
            this.file = file;
        }
        if (parent) {
            /** @type {WebFileEntry|undefined} */
            this.parent = parent;
            parent.addChild(this);
        }
        if (name) {
            /** @type {String} */
            this._name = name;
        }
        /** @type {"file"|"folder"} */
        this.type = type;
    }

    get name() {
        return this._name || this.file?.name;
    }

    /** @param {WebFileEntry} entry */
    addChild(entry) {
        if (!this.children) {
            /**
             * `undefined` if there is no child
             * @type {WebFileEntry[]|undefined}
             */
            this.children = [];
        }
        this.children.push(entry);
        this.increaseContentSize(entry.size);
    }

    /** @private
     *  @param {Number} size  */
    increaseContentSize(size) {
        if (!size) {
            return;
        }
        if (!this._contentSize) {
            /** @type {Number}
             *  @private  */
            this._contentSize = 0;
        }
        this._contentSize += size;
        if (this.parent/* && size*/) {
            this.parent.increaseContentSize(size);
        }
    }

    /**
     * Note: the folder size is computed on the creation step.
     * @return {Number}
     */
    get size() {
        if (this.type === "folder") {
            return this._contentSize || 0;
        }
        return this.file?.size || 0;
    }

    get mtime() {
        return this.file?.lastModified || 0;
    }

    /** @return {WebFileEntry[]} */
    get path() {
        if (!this.parent) {
            return [this];
        }
        return [...this.parent.path, this];
    }

    /** @return {Generator<WebFileEntry>} */
    *[Symbol.iterator]() {
        yield this;
        if (this.children) {
            for (const child of this.children) {
                yield * child;
            }
        }
    }

    /** @return {WebFileEntry[]} */
    flat() {
        return [...this];
    }

    /**
     * @param {WebFileEntry[]} entries
     * @return {WebFileEntry[]}
     */
    static flat(entries) {
        return entries.map(e => [...e]).flat();
    }

    /**
     * @param {DataTransferItem[]} dtItems
     * @return {Promise<WebFileEntry[]>}
     */
    static async fromDataTransferItems(dtItems) {
        const fileSystemEntries = await dtItemsToFileSystemEntries(dtItems);
        console.log("[fileSystemEntries]:", fileSystemEntries);
        /** @type {WebFileEntry[]} */
        const result = [];
        for (const fileSystemEntry of fileSystemEntries) {
            result.push(await fromFileSystemEntry(fileSystemEntry));
        }
        return result;
    }

    /**
     * @param {File[]} files
     * @return {WebFileEntry[]}
     */
    static fromFiles(files) {
        /** @type {WebFileEntry[]} */
        const result = [];
        for (const file of files) {
            result.push(new WebFileEntry({file, type: "file"}));
        }
        return result;
    }
}

/**
 * @param {FileSystemEntry} fsEntry
 * @param {WebFileEntry|null} parent
 * @return {Promise<WebFileEntry|null>}
 */
async function fromFileSystemEntry(fsEntry, parent = null) {
    if (fsEntry.isFile) {
        try {
            const file = await toFile(/** @type {FileSystemFileEntry} */ fsEntry);
            return new WebFileEntry({file, type: "file", parent});
        } catch (e) { // For example, for long path \\?\M:\...
            console.error("[fromFileSystemEntry][error]", fsEntry.name, e);
            return null;
        }
    } else if (fsEntry.isDirectory) {
        const dirEntry = new WebFileEntry({type: "folder", parent, name: fsEntry.name});
        /** @type {AsyncGenerator<FileSystemEntry>} */
        const entries = readFileSystemDirectoryEntry(/** @type {FileSystemDirectoryEntry} */ fsEntry);
        for await (const entry of entries) {
            // The entries will be attached to the parent (`dirEntry`).
            await fromFileSystemEntry(entry, dirEntry);
        }
        return dirEntry;
    }
}

/**
 * Works only with a http server
 * @param {FileSystemFileEntry} fsFileEntry
 * @return {Promise<File>}
 */
function toFile(fsFileEntry) {
    return new Promise((resolve, reject) => fsFileEntry.file(resolve, reject));
}

/**
 * @param {FileSystemDirectoryEntry} fsDirEntry
 * @return {AsyncGenerator<FileSystemEntry>}
 */
async function * readFileSystemDirectoryEntry(fsDirEntry) {
    const reader = fsDirEntry.createReader();
    let part = [];
    do {
        part = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
        for (const entry of part) {
            yield entry;
        }
    } while (part.length);
}

/**
 * @param {DataTransferItem[]} dtItems
 * @return {Promise<FileSystemEntry[]>}
 */
async function dtItemsToFileSystemEntries(dtItems) {
    const result = [];
    for (const entry of dtItems) {
        result.push(await dtItemToFileSystemEntry(entry));
    }
    return result;
}

/**
 * @param {DataTransferItem} entry
 * @return {Promise<FileSystemEntry>}
 */
async function dtItemToFileSystemEntry(entry) {
    return entry.webkitGetAsEntry();
}
