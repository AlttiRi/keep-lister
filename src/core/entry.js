/**
 * Meta info of a scan.
 * @typedef {Object} Meta
 * @property {String[]} path
 * @property {String} separator
 * @property {Number} scanDate
 * @property {String} platform
 * @property {Number} files
 * @property {Number} folders
 * @property {Number} symlinks
 * @property {Number} fifos
 * @property {Number} charDevs
 * @property {Number} blockDevs
 * @property {Number} sockets
 * @property {Number} unknowns
 * @property {Number} total
 * @property {Number} errors
 * @property {Error[]} unknownErrors
 */

export class SimpleEntry {
    //[Symbol.toStringTag] = "SimpleEntry";
    constructor({name, parent, type, meta, errors}) {
        Object.assign(this, {name, parent, type});
        if (meta) {
            Object.assign(this, {meta});
        }
        if (errors) {
            Object.assign(this, {errors});
        }
    }
    addChild(entry) {
        if (!this.children) {
            this.children = [];
        }
        this.children.push(entry);
    }
    get folders() {
        return this.children?.filter(e => e.type === "folder");
    }
    get files() {
        return this.children?.filter(e => e.type === "file");
    }
    get symlinks() {
        return this.children?.filter(e => e.type === "symlink");
    }

    get fifos() {
        return this.children?.filter(e => e.type === "fifo");
    }
    get charDevs() {
        return this.children?.filter(e => e.type === "charDev");
    }
    get blockDevs() {
        return this.children?.filter(e => e.type === "blockDev");
    }
    get sockets() {
        return this.children?.filter(e => e.type === "socket");
    }

    get isEmpty() {
        return !Boolean(this.children?.length);
    }
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

export function parseEntries(rootFolder, parent = null) {
    const root = new SimpleEntry({
        name: rootFolder.name,
        type: "folder",
        errors: rootFolder.errors,
        parent
    });
    if (rootFolder.folders) {
        rootFolder.folders.forEach(folder => {
            root.addChild(parseEntries(folder, root));
        });
    }
    const simpleTypes = ["file", "fifo", "charDev", "blockDev", "socket"];
    simpleTypes.forEach(type => {
        if (rootFolder[type+"s"]) {
            rootFolder[type+"s"].forEach(file => {
                root.addChild(new SimpleEntry({
                    name: file,
                    parent: root,
                    type: type
                }));
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
            const meta = symlink.pathTo ? {
                pathTo: symlink.pathTo
            } : null;
            root.addChild(new SimpleEntry({
                name: symlink.name,
                parent: root,
                type: "symlink",
                meta,
                errors: symlink.errors
            }));
        });
    }
    return root;
}

export const folderDummy = new SimpleEntry({name: ""});
