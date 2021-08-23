import {onMounted} from "vue";
import {setJson} from "./store.js";

export function localhostDebugHelper() {
    // Already opened directory, no need to open with input
    onMounted(async () => {
        // For example, localhost_debug_filename: "./test-data/[2021.08.13].json"
        const filepath = JSON.parse(localStorage.getItem("localhost_debug_filename"));
        if (filepath) {
            const response = await fetch(filepath);
            const data = await response.json();
            setJson(data);
        }
    });
}
