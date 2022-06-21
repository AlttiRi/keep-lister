import {ref, toRaw, isProxy} from "vue";
import {bytesToSizeWinLike, dateToDayDateTimeString, tripleSizeGroups} from "../util.js";

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
    console.log(isProxy(entry) ? "Proxy:" : "Raw:", toRaw(entry));
    if (entry.hasErrors) {
        debugMessage.value = "";
    } else {
        const name = `"` + entry.name.slice(0, 20) + (entry.name.length < 20 ? "" : "...") + `"`;

        let messages = [];
        if (entry.mtime !== undefined) {
            messages.push("mtime " + `"${dateToDayDateTimeString(entry.mtime, false)}"`);
        }
        if (entry.btime !== undefined) {
            messages.push("btime " + `"${dateToDayDateTimeString(entry.btime, false)}"`);
        }
        messages = [...messages, name, `${tripleSizeGroups(entry.size)} (${bytesToSizeWinLike(entry.size)})`];
        debugMessage.value = messages.join(" — ");
    }
}
