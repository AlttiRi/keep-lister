import {ref, Ref} from "vue";
import {FileInputState, getStateInstance} from "../components/file-input/file-input-state.js";

export const scanParsing:         Ref<boolean> = ref(false);
export const allScansReady:       Ref<boolean> = ref(true);
export const scansCount:          Ref<number>  = ref(0);
export const currentScansNum:     Ref<number>  = ref(0);
export const scanParsingProgress: Ref<number>  = ref(0);
export const searching:           Ref<boolean> = ref(false);
export const searchAwaiting:      Ref<boolean> = ref(false);

export const fileInputState: FileInputState = getStateInstance({recursive: false});
