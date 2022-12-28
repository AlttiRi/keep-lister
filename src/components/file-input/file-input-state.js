import {readonly} from "vue";
import {fileEntries as _fileEntries} from "./file-input-state-private.js";

/**@type {import("vue").DeepReadonly<import("vue").Ref<WebFileEntry[]>>} */
export const fileEntries = readonly(_fileEntries);
