/** @type {ScanEntryType[]} */
export const entryTypes = ["folder", "file", "symlink", "fifo", "charDev", "blockDev", "socket"];

export class SimpleEntry {
    // [Symbol.toStringTag] = "SimpleEntry"; // Disables reactivity, BTW.
    /**
     * @param {Object} init
     * @param {String} init.name
     * @param {SimpleEntry|null} init.parent
     * @param {ScanEntryType} init.type
     * @param {ScanEntryMeta} [init.meta]
     * @param {ScanEntryStats} [init.stats]
     * @param {ScanError[]} [init.errors]
     */
    constructor({name, parent, type, meta, stats, errors}) {
        /** @type {String} */
        this.name = name;
        /** @type {SimpleEntry|null} */
        this.parent = parent;
        /** @type {ScanEntryType} */
        this.type = type;

        if (meta) {
            /** @type {ScanEntryMeta|undefined} */
            this.meta = meta;
        }
        if (stats) {
            /** @type {ScanEntryStats|undefined} */
            this.stats = stats;
        }
        if (errors) {
            /** @type {ScanError[]|undefined} */
            this.errors = errors;
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
 * @param {ScanFolder} rootFolder
 * @param {SimpleEntry|null} parent
 * @return {SimpleEntry}
 */
export function parseEntries(rootFolder, parent = null) {
    /** @type {ScanEntryStats} */
    const stats = rootFolder.mtime ? {
        mtime: rootFolder.mtime,
    } : null;
    const root = new SimpleEntry({
        name: rootFolder.name,
        type: "folder",
        errors: rootFolder.errors,
        parent,
        stats
    });
    if (rootFolder.folders) {
        rootFolder.folders.forEach(folder => {
            root.addChild(parseEntries(folder, root));
        });
    }
    /** @type {ScanEntryType[]} */
    const simpleTypes = ["file", "fifo", "charDev", "blockDev", "socket"];
    simpleTypes.forEach(type => {
        if (rootFolder[type+"s"]) {
            rootFolder[type+"s"].forEach(/** @type {SimpleScanEntry|ScanStatEntry} */ file => {
                if (typeof file === "string") {
                    root.addChild(new SimpleEntry({
                        name: file,
                        parent: root,
                        type: type
                    }));
                } else {
                    root.addChild(new SimpleEntry({
                        name: file.name,
                        parent: root,
                        type: type,
                        stats: {
                            size: file.size,
                            mtime: file.mtime,
                        }
                    }));
                }
            });
        }
    });
    if (rootFolder.symlinks) {
        rootFolder.symlinks.forEach(symlink => {
            if (typeof symlink === "string") { // for old scans
                root.addChild(new SimpleEntry({
                    name: symlink,
                    parent: root,
                    type: "symlink"
                }));
                return;
            }
            /** @type {ScanSymlinkInfo} */
            const meta = symlink.pathTo ? {
                pathTo: symlink.pathTo
            } : null;

            /** @type {ScanEntryStats} */
            const stats = symlink.mtime ? {
                size: symlink.size,
                mtime: symlink.mtime,
            } : null;
            root.addChild(new SimpleEntry({
                name: symlink.name,
                parent: root,
                type: "symlink",
                meta,
                stats,
                errors: symlink.errors
            }));
        });
    }
    return root;
}

/** @type {SimpleEntry} */
export const folderDummy = new SimpleEntry({
    name: "",
    parent: null,
    type: "folder"
});
