import {ref} from "vue";
import {bytesToSize, dateToDayDateTimeString} from "../util.js";

export const debugMessage = ref("");
export function addMessage(message) {
    debugMessage.value = message;
}
export function appendMessage(message) {
    debugMessage.value += message;
}

/**
 * @param {SimpleEntry} entry
 */
export function debugMessageFromEntry(entry) {
    console.log(entry);
    if (entry.hasErrors) {
        debugMessage.value = "";
    } else {
        const name = `"` + entry.name.slice(0, 20) + (entry.name.length < 20 ? "" : "...") + `"`;

        let message = "";
        message += "mtime " + `"${dateToDayDateTimeString(entry.mtime, false)}"`;
        message += " —  btime " + `"${dateToDayDateTimeString(entry.btime, false)}"`;

        message += ` — ${name} — ${entry.size} (${bytesToSize(entry.size)})`;
        debugMessage.value = message;
    }
}
