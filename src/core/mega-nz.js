import {SimpleEntry} from "./entry.js";
import {openFolder} from "./folders.js";
import {addMessage} from "./debug.js";
import {dateToDayDateTimeString} from "../util.js";

// Some special
export async function handleMegaUrl(url) {
    addMessage(url);

    globalThis.Mega = await import("https://alttiri.github.io/meganz-api/meganz-api.standalone.es.js");
    // globalThis.Mega.MegaApi.encryptedName = true;

    let node;
    try {
        node = await globalThis.Mega.node(url);
    } catch (e) {
        addMessage(e);
        return;
    }
    node = node.root;
    console.log(node);

    /** @type {SimpleEntry} */
    let result = parseMegaNode(node);
    result._url = url;
    console.log(result);

    const special = {
        url,
        id: result._id,
        ownerId: result._ownerId,
        btime: result.btime && dateToDayDateTimeString(result.btime),
        mtime: result.mtime && dateToDayDateTimeString(result.mtime),
    };

    if (result.type !== "folder") { // if it's a share of 1 file
        const emptyRootFolder = new SimpleEntry({
            type: "folder",
            name: "",
            pid: null
        }, null);
        emptyRootFolder.addChild(result);
        result = emptyRootFolder;
    }

    result.root.addMeta({
        special
    });
    openFolder(result);
}

/** @return {SerializableScanEntry} */
function nodeToSEntry(node) {
    return {
        /**@type {string} */
        name: node.name === null ? "[encrypted]" : node.name,
        /**@type {number} */
        size: node.size,
        /**@type {number} */
        btime: node.creationDate * 1000,
        /**@type {number} */
        mtime: node.modificationDate * 1000,
        /**@type {String} */
        id: node.id,
        /**@type {ScanEntryType} */
        type: (node.type === "rootFolder" || node.type === "folder") ? "folder" : "file",
        /**@type {String} */
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
