/** @type {ScanEntryType[]} */
export const entryTypes = ["folder", "file", "symlink", "fifo", "charDev", "blockDev", "socket"];

export class SimpleEntry {
    // [Symbol.toStringTag] = "SimpleEntry"; // Disables reactivity, BTW.
    /**
     * @param {SerializableScanEntry} entry
     * @param {SimpleEntry|null} parent
     */
    constructor(entry, parent) {
        /** @type {String} */
        this.name = entry.name;
        /** @type {SimpleEntry|null} */
        this.parent = parent;
        /** @type {ScanEntryType} */
        this.type = entry.type;

        if (entry.size) {
            /** @type {Number|undefined} */
            this._size = entry.size;
        }
        if (entry.mtime) {
            /** @type {Number|undefined} */
            this.mtime = entry.mtime;
        }
        if (entry.btime) {
            /** @type {Number|undefined} */
            this.btime = entry.btime;
        }

        if (entry.errors) {
            /** @type {ScanError[]|undefined} */
            this.errors = entry.errors;
        }

        if (entry.pathTo) {
            /** @type {String|undefined} */
            this.pathTo = entry.pathTo;
        }
        if (entry.content) {
            /** @type {String|undefined} */
            this.content = entry.content;
        }
    }
    /** @param {SimpleEntry} entry */
    addChild(entry) {
        if (!this.children) {
            /** @type {SimpleEntry[]|undefined} */
            this.children = [];
        }
        this.children.push(entry);
    }

    get size() {
        if (this.type === "folder") {
            return -0; // todo
        }
        return this._size || 0;
    }

    /** @return {SimpleEntry[]} */
    get folders() {
        return this.children?.filter(e => e.type === "folder") || [];
    }
    /** @return {SimpleEntry[]} */
    get files() {
        return this.children?.filter(e => e.type === "file") || [];
    }
    /** @return {SimpleEntry[]} */
    get symlinks() {
        return this.children?.filter(e => e.type === "symlink") || [];
    }

    /** @return {SimpleEntry[]} */
    get fifos() {
        return this.children?.filter(e => e.type === "fifo") || [];
    }
    /** @return {SimpleEntry[]} */
    get charDevs() {
        return this.children?.filter(e => e.type === "charDev") || [];
    }
    /** @return {SimpleEntry[]} */
    get blockDevs() {
        return this.children?.filter(e => e.type === "blockDev") || [];
    }
    /** @return {SimpleEntry[]} */
    get sockets() {
        return this.children?.filter(e => e.type === "socket") || [];
    }

    /** @return {Boolean} */
    get isEmpty() {
        return !Boolean(this.children?.length);
    }
    /** @return {Boolean} */
    get hasErrors() {
        return Boolean(this.errors?.length);
    }
    /** @return {SimpleEntry} */
    get root() {
        if (!this.parent) {
            return this;
        }
        return this.parent.root;
    }
    /** @return {SimpleEntry[]} */
    get path() {
        if (!this.parent) {
            return [this];
        }
        return [...this.parent.path, this];
    }
}

/**
 * @param {SerializableScanEntry[]} sEntries
 * @return {SimpleEntry}
 * */
export function parseFlatScan(sEntries) {
    /** @type {Map<Number, SimpleEntry>} */
    const map = new Map();

    for (const entry of sEntries) {
        /** @type {SimpleEntry|null}*/
        const parent = map.get(entry.pid) ?? null;
        const simpleEntry = new SimpleEntry(entry, parent);
        if (entry.type === "folder") {
            map.set(entry.id, simpleEntry);
        }
        parent?.addChild(simpleEntry);
    }
    // console.log(map);
    return map.get(0);
}

/** @type {SimpleEntry} */
export const folderDummy = new SimpleEntry({
    type: "folder",
    name: "",
    pid: null,
}, null);
