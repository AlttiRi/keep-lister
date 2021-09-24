# directory-snapshot-explorer
There is two parts of the software:

- The scanner. It creates a JSON snapshots with meta information _(`name`, `type`, `size`, `mtime`, `crtime`, `hardlink`/`symlink` info)_ of your local files. (See: [how to use](#how-to-use) ↓)
- [The explorer](https://alttiri.github.io/directory-snapshot-explorer/) for these JSON snapshots. 

You can create a snapshot of your external hard drive's content and use the explorer for the created scnapshot to check the content of the hard drive when it's detached.

---

Just look at the examples:

**[Win 10 scan (as Admin)](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows-admin.json.gz)** | 
[Win 10 scan](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows.json.gz)

![Screenshot Win](https://user-images.githubusercontent.com/16310547/133657123-d1547a7b-6497-4da6-88ec-6e4928b2b044.png)


**[Ubuntu scan (as Root)](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/ubuntu-admin.json.gz)** | 
[Ubuntu scan](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/ubuntu.json.gz)

![Screenshot Ubnt](https://user-images.githubusercontent.com/16310547/133657142-75f15c86-ce70-4ef6-a21b-cdc0310bbb7e.png)

[Linux Source Code scan](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/linux-master.json.gz)


---

Search is case sensitive.

[.exe](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows-admin.json.gz&search=.exe)

![Screenshot Search](https://user-images.githubusercontent.com/16310547/133657172-685801b2-5895-4876-8730-b11b8553f168.png)

Search by file type, for example: `/type:folder/query`
(`folder`, `file`, `symlink` for Windows and `fifo`, `charDev`, `blockDev`, `socket` in additional for other platforms).

[/type:folder/.exe](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows-admin.json.gz&search=/type:folder/.exe)

![Screenshot Search Folder](https://user-images.githubusercontent.com/16310547/133657180-9fc03183-d50d-47ff-badc-252fcdfe6952.png)

Only up to 1000 rows are displayed.

---
# How to use.

In short.
- [Installed Node.js](https://nodejs.org/en/download/current/) is required,
- Download the scanner file — [zz-dir-scanner.mjs](https://github.com/AlttiRi/directory-snapshot-explorer/releases/download/0.2.0/zz-dir-scanner.mjs),
- Open a terminal (CMD.exe, for example) in a folder to scan, 
- Type in a terminal _(for Windows with CMD)_:
```cmd
node C:\%HOMEPATH%\Downloads\zz-dir-scanner.mjs
```
- Type enter.

The result will be in your download folder.

---

_Note: replace `C:\%HOMEPATH%\Downloads\zz-dir-scanner.mjs` with the path to the scanner file if you have moved it from the download folder to an other place._

To explore the scan result use https://alttiri.github.io/directory-snapshot-explorer/ site.

Or run it locally:
- Download the source code [directory-snapshot-explorer-master.zip](https://github.com/AlttiRi/directory-snapshot-explorer/archive/refs/heads/master.zip),
- Unpack it,
- Open terminal in `directory-snapshot-explorer-master` folder,
- Type `npm ci`,
- Then type `npm run build`,
- Then type `npm run serve`.

The site will be available on http://localhost:5000/. Use `Ctrl+C` in the console to stop the server. Next time you only need to type `npm run serve` to start the server.


---

# About

There is a lot of things that to do to improve it. But the core functional is.


## Similar software
- [Snap2HTML](https://github.com/rlv-dan/Snap2HTML)
 
Technically I also can generate a standalone HTML file as output, but do you need it?
