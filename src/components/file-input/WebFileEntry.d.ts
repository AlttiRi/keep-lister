declare enum WebFileEntryType {
    file = "file",
    folder = "folder",
}

export interface FileWithPath extends File {
    readonly path?: string;
}

export class WebFileEntry implements Iterable<WebFileEntry> {
    public  readonly type?:   WebFileEntryType
    public  readonly file?:   FileWithPath | File
    public  readonly parent?: WebFileEntry
    private readonly _name:   string

    public children?: WebFileEntry[]
    private _contentSize: number

    constructor(opts: {
        file?: File,
        parent?: WebFileEntry,
        type: WebFileEntryType,
        name?: string
    })

    get nativePath(): string | undefined
    get name(): string | undefined
    private addChild(entry: WebFileEntry)
    private increaseContentSize(size: number)
    get size(): number
    get mtime(): number
    get path(): WebFileEntry[]

    [Symbol.iterator](): Iterator<WebFileEntry>;
    flat(): WebFileEntry[]

    static flat(entries: WebFileEntry[]): WebFileEntry[]

    static fromDataTransfer(dt: DataTransfer, recursive: boolean): Promise<WebFileEntry[]>
    static fromFiles(files: File[], type?: WebFileEntryType): WebFileEntry[]
}
