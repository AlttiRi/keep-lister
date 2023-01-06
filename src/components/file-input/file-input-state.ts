import {computed, ComputedRef, DeepReadonly, readonly, Ref, ref, toRaw, watchEffect} from "vue";
import {WebFileEntry, WebFileEntryType} from "./WebFileEntry.js";

export type FileInputStatePrivate = {
    inputElem:   Ref<HTMLInputElement>,
    fileEntries: Ref<WebFileEntry[]>,
    file:  ComputedRef<WebFileEntry>,
    count: ComputedRef<number>,

    dropHover: Ref<boolean>,
    dropHoverItemCount: Ref<number>,
    dropHoverTypes: Ref<string[]>,
    parsing: Ref<boolean>,

    setDataTransferHover(dt: DataTransfer): void,
    resetDataTransferHover(): void,
    setDataTransfer(dt: DataTransfer): void,
    setFiles(filelist: FileList, resetDataTransfer?: boolean): void,

    isNwDirectory: Ref<boolean>,
}

export type FileInputState = {
    fileEntries: DeepReadonly<Ref<WebFileEntry[]>>,
    clearInput(): void,
    private: FileInputStatePrivate,
}

declare const nw: any
const isNW: boolean = typeof nw !== "undefined" && nw["process"]?.["__nwjs"] === 1;

export function getStateInstance({recursive} = {recursive: false}): FileInputState {
    const fileEntries:  Ref<WebFileEntry[]>     = ref([]);
    const files:        Ref<File[]>             = ref([]);
    const inputElem:    Ref<HTMLInputElement>   = ref(null);
    const parsing:      Ref<boolean>            = ref(false);
    const dtItems:      Ref<DataTransferItem[]> = ref([]);
    const dataTransfer: Ref<DataTransfer>    = ref(null);
    const dropHover:    Ref<boolean>         = ref(false);
    const dropHoverItemCount: Ref<number>    = ref(0);
    const dropHoverTypes:     Ref<string[]>  = ref([]);
    const isNwDirectory:      Ref<boolean>   = ref(false);

    watchEffect(async () => {
        const time: number = Date.now();
        parsing.value = true;
        if (dataTransfer.value) {
            console.log("[fromDataTransferItems]");
            fileEntries.value = await WebFileEntry.fromDataTransfer(dataTransfer.value, recursive);
        } else
        if (isNW && isNwDirectory.value) {
            console.log("[isNwDirectory]");
            fileEntries.value = WebFileEntry.fromFiles(files.value, WebFileEntryType.folder);
        } else {
            console.log("[fromFiles]");
            fileEntries.value = WebFileEntry.fromFiles(files.value);
        }
        parsing.value = false;
        console.log("[WebFileEntry parsing][time]:", Date.now() - time, "ms");
        console.log("[fileEntries]", toRaw(fileEntries.value));
    });

    const file: ComputedRef<WebFileEntry> = computed(() => {
        return fileEntries.value[0];
    });

    const count: ComputedRef<number> = computed(() => {
        return fileEntries.value.length;
    });

    function setDataTransferHover(dt: DataTransfer) {
        const count:    number   = dt.items.length;
        const allTypes: string[] = [...dt.items].map(item => item.type);
        const types:    string[] = [...new Set(allTypes)];

        dropHoverItemCount.value = count;
        dropHoverTypes.value = types;
        console.log("[setDataTransferHover]:", count, types);
    }
    function resetDataTransferHover() {
        dropHoverItemCount.value = 0;
        dropHoverTypes.value = [];
    }

    function setDataTransfer(dt: DataTransfer) {
        console.log("setDataTransfer", dt);
        setFiles(dt.files, false);
        _setDtItems(dt.items);
        dataTransfer.value = dt;
    }
    function setFiles(filelist: FileList, resetDataTransfer: boolean = true) {
        const _files: File[] = [...filelist];
        files.value = _files;
        console.log("[setFiles]:", _files);
        if (resetDataTransfer) {
            dataTransfer.value = null;
            dtItems.value = [];
        }
    }
    function _setDtItems(items: DataTransferItemList) {
        const _dtItems: DataTransferItem[] = [...items];
        dtItems.value = _dtItems;
        console.log("[_setDtItems]:", _dtItems); // bug in chromium: `type` and `kind` is "" in the console when expand the array.
        console.log("[_setDtItems][0]:", {
            kind: _dtItems[0].kind, type: _dtItems[0].type
        });
    }

    function clearInput() {
        inputElem.value.value = null;
        files.value = [];
        dataTransfer.value = null;
        dtItems.value = [];
    }

    return {
        fileEntries: readonly(fileEntries),
        clearInput,
        private: {
            dropHover, dropHoverItemCount, dropHoverTypes,
            fileEntries, parsing,
            file, count,
            setDataTransferHover, resetDataTransferHover,
            setDataTransfer, setFiles,
            isNwDirectory,
            inputElem,
        }
    };
}
