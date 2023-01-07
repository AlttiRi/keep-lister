import {DeepReadonly, Ref, watch} from "vue";
import {clearHome, home, openFolder, setScan} from "./folders.js";
import {allScansReady, currentScansNum, fileInputState, scansCount} from "./state";
import {debugMessageFromEntry} from "./debug.js";
import {WebFileEntry} from "../components/file-input/WebFileEntry";


const fileEntries: DeepReadonly<Ref<WebFileEntry[]>> = fileInputState.fileEntries;

watch(fileEntries, async () => {
    clearHome();
    allScansReady.value = false;
    scansCount.value = fileEntries.value.length;
    currentScansNum.value = 0;
    for (const webFileEntry of fileEntries.value) {
        currentScansNum.value++;
        await setScan(webFileEntry.file, true);
    }
    if (fileEntries.value.length > 1) {
        openFolder(home.value, true);
        debugMessageFromEntry(home.value);
    }
    allScansReady.value = true;
});
