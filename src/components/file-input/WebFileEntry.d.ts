declare enum WebFileEntryType {
    file = "file",
    folder = "folder",
}

export interface FileWithPath extends File {
    readonly path?: string;
}

export class WebFileEntry implements Iterable<WebFileEntry> {
    readonly type?:   WebFileEntryType
    readonly file?:   File | FileWithPath
    readonly parent?: WebFileEntry
    readonly _name:   string

    children?: WebFileEntry[]
    _contentSize: number

    constructor(opts: {
        file?: File,
        parent?: WebFileEntry,
        type: WebFileEntryType,
        name?: string
    })

    get nativePath(): string | undefined
    get name(): string | undefined
    addChild(entry: WebFileEntry)
    increaseContentSize(size: number)
    get size(): number
    get mtime(): number
    get path(): WebFileEntry[]

    [Symbol.iterator](): Iterator<WebFileEntry>;
    flat(): WebFileEntry[]

    static flat(entries: WebFileEntry[]): WebFileEntry[]

    static fromDataTransfer(dt: DataTransfer, recursive: boolean): Promise<WebFileEntry[]>
    static fromFiles(files: File[], type?: WebFileEntryType): WebFileEntry[]
}
