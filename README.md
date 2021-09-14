# directory-snapshot-explorer

Work in progress.

File explorer for JSON snapshots with meta information _(`name`, `type`, `size`, `mtime`, `crtime`, ...*)_ of local files. Scanner for creating of snapshots is included.

![Screenshot](https://user-images.githubusercontent.com/16310547/133143091-d8dcdccb-ab60-4697-a891-8d13f13a920d.png)


---
What? Just look:

--> **[Win 10 scan (as Admin)](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/2021.09.09-wa.json.gz)** <--

[Win 10 scan (Temporary unavailable)](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-scans/win10upd.json)

[Ubuntu scan (Temporary unavailable)](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-scans/ubuntu.json)

[Ubuntu scan (as Root) (Temporary unavailable)](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-scans/ubuntu-admin.json)

[Linux Source Code scan (Temporary unavailable)](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-scans/linux-master.json)

*Temporary unavailable ones use the old scan format. I need to rescan it.

---

Search is case sensitive.

Search by file type, for example: `/type:folder/query`
(`folder`, `file`, `symlink` for Windows and `fifo`, `charDev`, `blockDev`, `socket` in additional for other platforms).

Only up to 1000 rows are displayed.

---

*It also contains information about symlinks (where it go) and hard links (count of it).

