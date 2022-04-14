import {SimpleEntry} from "./entry.js";
import {meta, openFolder, root} from "./folders.js";
import {addMessage} from "./debug.js";

// Some special
export async function handleMegaUrl(url) {
    globalThis.Mega = await import("https://alttiri.github.io/meganz-api/meganz-api.standalone.es.js");
    let node;
    try {
        node = await globalThis.Mega.node(url);
    } catch (e) {
        addMessage(e);
        return;
    }
    console.log(node);

    let result = parseMegaNode(node);
    console.log(result);

    if (result.type !== "folder") { // if it's a share of 1 file
        const emptyRootFolder = new SimpleEntry({
            type: "folder",
            name: "",
            pid: null
        }, null);
        emptyRootFolder.addChild(result);
        result = emptyRootFolder;
    }

    result._url = url;

    root.value = result;
    meta.value = {};
    openFolder(root.value);
}

/** @return {SerializableScanEntry} */
function nodeToSEntry(node) {
    return {
        name: node.name === null ? "[encrypted]" : node.name,
        size: node.size,
        btime: node.creationDate * 1000,
        mtime: node.modificationDate * 1000,
        id: node.id,
        type: (node.type === "rootFolder" || node.type === "folder") ? "folder" : "file",
        pid: node.parentId,
    };
}

function toSEntry(megaNode, parent) {
    /** @type {SerializableScanEntry}   */
    const ssEntry = nodeToSEntry(megaNode);
    const sEntry = new SimpleEntry(ssEntry, parent);
    sEntry._id = megaNode.id;
    sEntry._ownerId = megaNode.ownerId;
    return sEntry;
}

function parseMegaNode(megaNode, parent = null) {
    const sEntry = toSEntry(megaNode, parent);
    if (sEntry.type === "folder") {
        for (const mNode of [...megaNode.folders, ...megaNode.files]) {
            parseMegaNode(mNode, sEntry);
        }
    }
    return sEntry;
}
