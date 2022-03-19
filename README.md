# File manager snapshot explorer

You can create a meta snapshot of your external hard drive's content and use this explorer to look at the content of the hard drive when it's detached. For the local hard drives it is pretty too, it can be an alternative for Windows Explorer' search thing.

There are two parts of the software:

- The scanner. It creates a JSON snapshots with meta information _(`name`, `type`, `size`, `mtime`, `crtime`, `hardlink`/`symlink` info)_ of your local files. (See: [how to use ↓](#how-to-use)))
- [The explorer](https://alttiri.github.io/directory-snapshot-explorer/) to open these JSON snapshots. 


---

Just look at the examples (click on the links to open the site with the demo scans):

**[Win 10 scan (as Admin)](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows-admin.json.gz)** | 
[Win 10 scan](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows.json.gz)

![Screenshot Win](https://user-images.githubusercontent.com/16310547/133657123-d1547a7b-6497-4da6-88ec-6e4928b2b044.png)


**[Ubuntu scan (as Root)](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/ubuntu-admin.json.gz)** | 
[Ubuntu scan](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/ubuntu.json.gz)

![Screenshot Ubnt](https://user-images.githubusercontent.com/16310547/133657142-75f15c86-ce70-4ef6-a21b-cdc0310bbb7e.png)

[Linux Source Code scan](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/linux-master.json.gz)


---

Some search examples:

[.exe](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows-admin.json.gz&search=.exe)

![Screenshot Search](https://user-images.githubusercontent.com/16310547/133657172-685801b2-5895-4876-8730-b11b8553f168.png)

For case sensitive search use `//`, for example: [//.EXE](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows-admin.json.gz&search=//.EXE)

### Search by type

Search by file type, for example: `/type:folder/query`
(`folder`, `file`, `symlink` for Windows and `fifo`, `charDev`, `blockDev`, `socket` in additional for other platforms).

[/type:folder/.exe](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows-admin.json.gz&search=/type:folder/.exe)

![Screenshot Search Folder](https://user-images.githubusercontent.com/16310547/133657180-9fc03183-d50d-47ff-badc-252fcdfe6952.png)

---

### List everything

To list recursively all items of an opened folder use [`//`](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows-admin.json.gz&search=//) search.

---

### URL Search

You can search by pasting URL in the search fiels, if the URL's pathname ends with an information included in file names you will find it, for example:

Search `https://i.imgur.com/x09ICAM.jpeg` will list:
- [imgur] 2015.09.18—x09ICAM—3456.jpg

Search `https://pbs.twimg.com/media/FFyAEbTUYAEUm9p?format=jpg&name=4096x4096` will list:
- [twitter] SpaceX—2021.12.04—1467202583840243712—FFyAEbTUYAEUm9p.jpg

Search `https://twitter.com/SpaceX/status/1463536409667530755` will list:
- [twitter] SpaceX—2021.11.24—1463536409667530755—FE-GSYWUcAgc9BN.jpg
- [twitter] SpaceX—2021.11.24—1463536409667530755—FE-GWCKVgAorchy.jpg
- [twitter] SpaceX—2021.11.24—1463536409667530755—FE-GXQYUYAcfvUl.jpg

_BTW, look at [this thing](https://github.com/AlttiRi/twitter-click-and-save)._

Search `https://www.instagram.com/p/CWqleONFgK4/` will list:
- [inst] spacex—2021.11.24—CWqleONFgK4—260727536_471249894638202_6939249621560480797_n.jpg
- [inst] spacex—2021.11.24—CWqleONFgK4—259683601_272614248155822_44594239323667647_n.jpg

Search `https://www.youtube.com/watch?v=_qwLHlVjRyw` will list:
- [yt] SpaceX—2020.12.23—_qwLHlVjRyw—Starship _ SN8 _ High-Altitude Flight Recap.description
- [yt] SpaceX—2020.12.23—_qwLHlVjRyw—Starship _ SN8 _ High-Altitude Flight Recap.webm
- [yt] SpaceX—2020.12.23—_qwLHlVjRyw—Starship _ SN8 _ High-Altitude Flight Recap.webp

Search `https://gfycat.com/incompletealarmedicelandichorse` will list:

- [gfycat] blaze0044—2021.03.27—IncompleteAlarmedIcelandichorse—Space X rocket breakup.mp4
- [gfycat] blaze0044—2021.03.27—IncompleteAlarmedIcelandichorse—Space X rocket breakup.webm


_BTW, looks at [this thing](https://github.com/AlttiRi/gfycat-id-camel-caser#readme). It will CamelCase `incompletealarmedicelandichorse` to `IncompleteAlarmedIcelandichorse`. And you find it by the search._

---

### Size search




- `/size:0`       — find 0 byte size entries
- `/size/120`     — the same, find 120 bytes size entries
- `/size:120+80`  — find from 120 to 200
- `/size:120+80`  — find from 120 to 200
- `/size:120+-20` — find from 100 to 120
- `/size:120~20`   — find from  80 to 140
- `/size:120-220` — find from 120 to 220
- `/size:220-120` — find from 120 to 220

- [More examples...](https://github.com/AlttiRi/directory-snapshot-explorer/blob/1ecec3403db98c9683adbbae48955a4ccbed5366/src/core/search.js#L183-L217)

---
# How to use

In short.
- [Installed Node.js](https://nodejs.org/en/download/current/) is required,
- Download the scanner file — [zz-dir-scanner.mjs](https://github.com/AlttiRi/directory-snapshot-explorer/releases/download/0.2.1/zz-dir-scanner.mjs),
- Open a terminal (CMD.exe, for example) in a folder you want to scan, 
- Run the scanner (JS file) with Node.js — type in a terminal _(for Windows with CMD)_:
```cmd
node %USERPROFILE%\Downloads\zz-dir-scanner.mjs
```
- Don't forget to type enter.

The result will be in your download folder.

---

_Note: replace `%USERPROFILE%\Downloads\zz-dir-scanner.mjs` with the path to the scanner file if you have moved it from the download folder to an other place._

---

To explore the scan result use https://alttiri.github.io/directory-snapshot-explorer/ site.

Or run it locally:
- Download the source code [directory-snapshot-explorer-master.zip](https://github.com/AlttiRi/directory-snapshot-explorer/archive/refs/heads/master.zip),
- Unpack it,
- Open terminal in `directory-snapshot-explorer-master` folder,
- Type `npm ci`,
- Then `npm run build`,
- Then `npm run serve`.

The site will be available on http://localhost:5000/. Use `Ctrl + C` in the console to stop the server. Next time you only need to type `npm run serve` to start the server.


---

# About


### File size formating

It uses Windows-like file size formatting (`1133158 bytes` → `1.08 MB`). 
In most cases the result is equal to Windows Explorer result, but in very rare cases is not. See [the test file](https://github.com/AlttiRi/directory-snapshot-explorer/blob/master/tests/win-like-file-sizes.test.js).


### JSON size

JSON scans can be noticeable in size, so they are gzipped to reduce the size in 5-10 times. 
For example, [Windows' disk C scan](https://alttiri.github.io/directory-snapshot-explorer/?filepath=/json-flat-scans/windows-admin.json.gz) (300k files, 90k folders) takes 5.8 MB gzipped (55 MB of raw JSON). 
The explorer handles the scan in stream way, so it displays the result as soon as the first bytes of the scan are read.


### JSON format

JSON snapshot is a valid JSON file, but it is special formatted to simplify the stream parsing and opening with text editors. 

Just look at the example _(Note: some lines are trimmed to reduce size)_:
```json
[
{
 "path": ["C:", "Users", "User", "Downloads"],
 "separator": "\\",
 "scanDate": "2021.09.24 23:52:02Z",
 "platform": "win32",
 "files": 37,
 "folders": 7,
 "symlinks": 0,
 "fifos": 0,
 "charDevs": 0,
 "blockDevs": 0,
 "sockets": 0,
 "total": 44,
 "errors": 0,
 "mHardLinks": 0,
 "mHardLinksTotal": 0,
 "errorsMap": {}
},

{"type":"folder","name":"directory-snapshot-explorer-master","pid":null,"id":0,"mtime":1632527508334,"btime":1632527508312},
{"type":"folder","name":".github","pid":0,"id":1,"mtime":1632526451000,"btime":1632527508312},
{"type":"file","name":".gitignore","pid":0,"mtime":1632526451000,"btime":1632527508314,"size":53},
{"type":"file","name":"index.html","pid":0,"mtime":1632526451000,"btime":1632527508315,"size":843},
{"type":"file","name":"package-lock.json","pid":0,"mtime":1632526451000,"btime":1632527508315,"size":70293},
{"type":"file","name":"package.json","pid":0,"mtime":1632526451000,"btime":1632527508316,"size":874},
{"type":"file","name":"README.md","pid":0,"mtime":1632526451000,"btime":1632527508314,"size":4437},
{"type":"folder","name":"scanner","pid":0,"id":2,"mtime":1632526451000,"btime":1632527508316},
{"type":"folder","name":"src","pid":0,"id":3,"mtime":1632526451000,"btime":1632527508319},
{"type":"folder","name":"tests","pid":0,"id":4,"mtime":1632526451000,"btime":1632527508332},
{"type":"file","name":"vite.config.js","pid":0,"mtime":1632526451000,"btime":1632527508334,"size":5379},
{"type":"folder","name":"workflows","pid":1,"id":5,"mtime":1632526451000,"btime":1632527508313},
{"type":"file","name":"blank.yml","pid":5,"mtime":1632526451000,"btime":1632527508313,"size":3260},
{"type":"file","name":"flat-scan-object.js","pid":2,"mtime":1632526451000,"btime":1632527508316,"size":5087},
{"type":"file","name":"meta.js","pid":2,"mtime":1632526451000,"btime":1632527508317,"size":4119},
{"type":"file","name":"scanner.js","pid":2,"mtime":1632526451000,"btime":1632527508318,"size":8607},
{"type":"file","name":"util-node.js","pid":2,"mtime":1632526451000,"btime":1632527508318,"size":7314},
{"type":"file","name":"App.vue","pid":3,"mtime":1632526451000,"btime":1632527508319,"size":288},
{"type":"folder","name":"components","pid":3,"id":6,"mtime":1632526451000,"btime":1632527508319},
{"type":"file","name":"AddressBar.vue","pid":6,"mtime":1632526451000,"btime":1632527508320,"size":854}
]
```

### Global variables

There are `folder` and `search` variables in the browser console to handle entries of "opened folder"/"search result" in program way.

For example:

```js
// List names of files in an opened folder as one string
folder.files.map(e => e.name).join("\n")
```
```js
// Find the most long filenames
// (`flat` (`folder.flat()`) recursively lists all files of the selected directory in an array)
flat.reduce((acc, entry) => {
    const name = entry.name;
    const length = acc[0].length;
    if (name.length > length) {
        return [name];
    }
    if (name.length === length) {
        acc.push(name);
        return acc;
    }
    return acc;
}, [""])
```

If you have files with the special filenames (see [@AlttiRi/twitter-click-and-save#filename-format](https://github.com/AlttiRi/twitter-click-and-save#filename-format)) which include some additional information about the file it's not a problem, for example, to count downloaded posts (one post can have multiple files):

First list all files of certain author, for example, with `[twitter] SpaceX` search and then:
```js
// Parse the post ID from the filenames, then count the number of unique IDs.
new Set(
    folder
        .flat()
        .filter(entry => entry.type === "file")
        .map(entry => entry.name)
        .map(name => {
            const result = name.match(/\[twitter\] (?<author>.+)—(?<date>\d{4}\.\d{2}\.\d{2})—(?<postId>[^—]+)—(?<filename>.+)/);
            if (result) {
                return result.groups;
            }
            return null;
        })
        .filter(result => result)
        .map(result => result.postId)
).size
```

## Static site

[This site](https://alttiri.github.io/directory-snapshot-explorer/) is static, it has no backend to handle JSON snapshots, it handles them locally on your machine after your browser have downloaded the site's files (HTML, JS, CSS) hosted by GitHub Pages.

So, you do not send your personal data (JSON snapshots) anywhere. Also the site has no analytics, it contains only code is necessary for the work.

But it's just a text. If you don't trust it (it's OK) to be sure that your data in safety (without verifying of the source code, or inspecting the site with DevTools) you can just open the site in an incognito window, disable the Internet access, work with the site, then close the incognito window and only after that enable the Internet access.

_(Note: `pako_inflate` library is lazy loaded, so you can open one of the demo snapshots first to load it, or just unpack your JSON snapshot from `.gz` archive — in this case `pako_inflate` is no needed.)_


## Similar software
- [Snap2HTML](https://github.com/rlv-dan/Snap2HTML)*
- FilelistCreator
- [Directory Snapshot](https://github.com/Anmol-Singh-Jaggi/Directory-Snapshot)
 
\*Technically I also can generate a standalone HTML file as output, but do you need it?


---

## Postscript

There are a lot of things that to do to improve it. But the core functional is ready.
