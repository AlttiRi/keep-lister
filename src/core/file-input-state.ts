import {FileInputState, getStateInstance} from "../components/file-input/file-input-state";
import {DeepReadonly, Ref, toRaw, watch} from "vue";
import {clearHome, home, openFolder, setScan} from "./folders.js";
import {allScansReady, currentScansNum, scansCount} from "./state.js";
import {debugMessageFromEntry} from "./debug.js";
import {WebFileEntry} from "../components/file-input/WebFileEntry";

export const fileInputState: FileInputState = getStateInstance({recursive: false});

const fileEntries: DeepReadonly<Ref<WebFileEntry[]>> = fileInputState.fileEntries;

watch(fileEntries, async () => {
    clearHome();
    allScansReady.value = false;
    scansCount.value = fileEntries.value.length;
    currentScansNum.value = 0;
    for (const {file} of fileEntries.value) {
        currentScansNum.value++;
        await setScan(file, true);
    }
    if (fileEntries.value.length > 1) {
        openFolder(home.value, true);
        debugMessageFromEntry(home.value);
    }
    allScansReady.value = true;
});
