import {onMounted} from "vue";
import {readJsonFile} from "./store.js";

const filename = "[2021.08.13].json";

export function localhostDebug() {
    // Already opened directory, no need to open with input
    onMounted(async () => {
        const isLocalDebug = JSON.parse(localStorage.getItem("localhost_debug"));
        if (isLocalDebug) {
            const url = "./test-data/" + filename;
            const response = await fetch(url);
            const data = await response.json();
            readJsonFile(data);
        }
    });
}
