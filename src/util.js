export const setImmediate = globalThis.setImmediate || /*#__PURE__*/ (function() {
    const {port1, port2} = new MessageChannel();
    const queue = [];

    port1.onmessage = function() {
        const callback = queue.shift();
        callback();
    };

    return function(callback) {
        port2.postMessage(null);
        queue.push(callback);
    };
})();

export function sleep(ms) {
    if (ms === undefined) {
        return new Promise(resolve => setImmediate(resolve));
    }
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const shuffle = () => Math.random() >= 0.5 ? -1 : 1;

const videoExtensions = ["mp4", "webm", "mkv", "avi"];
export function isVideo(filename) {
    const {ext} = filename.match(/(?<ext>[^.]+)$/).groups;
    return videoExtensions.includes(ext);
}
const imageExtensions = ["png", "jpg", "jpeg", "gif", "tiff", "webp"];
export function isImage(filename) {
    const {ext} = filename.match(/(?<ext>[^.]+)$/).groups;
    return imageExtensions.includes(ext);
}

export function debounce(runnable, ms = 50) {
    let timerId;
    return function() {
        // console.log({timerId});
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            runnable.apply(this, arguments);
            timerId = null;
        }, ms);
    }
}

// "Sun, 10 Jan 2021 22:22:22 GMT" -> "2021.01.10"
export function dateToDayDateString(dateValue, utc = true) {
    const _date = new Date(dateValue);
    if (_date.toString() === "Invalid Date") {
        console.warn("Invalid Date value: ", dateValue);
    }
    function pad2(str) {
        return str.toString().padStart(2, "0");
    }
    const _utc = utc ? "UTC" : "";
    const year  = _date[`get${_utc}FullYear`]();
    const month = _date[`get${_utc}Month`]() + 1;
    const date  = _date[`get${_utc}Date`]();

    return year + "." + pad2(month) + "." + pad2(date);
}

// "Sun, 10 Jan 2021 22:22:22 GMT" -> "2021.01.10 22:22:22Z"
export function dateToDayDateTimeString(dateValue, utc = true) {
    const _date = new Date(dateValue);
    function pad2(str) {
        return str.toString().padStart(2, "0");
    }
    const _utc = utc ? "UTC" : "";
    const hours    = _date[`get${_utc}Hours`]();
    const minutes  = _date[`get${_utc}Minutes`]();
    const seconds  = _date[`get${_utc}Seconds`]();

    const time = pad2(hours)+ ":" + pad2(minutes) + ":" + pad2(seconds);
    return dateToDayDateString(_date, utc) + " " + time + (utc ? "Z" : "");
}


export function structuredClone(object) {
    return new Promise(resolve => {
        const {port1, port2} = new MessageChannel();
        port1.onmessage = function(message) {
            resolve(message.data);
        };
        port2.postMessage(object);
    });
}

export function appendScript(src, integrity) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.onload = resolve;
        script.onerror = event => reject({message: "Failed to load script", src, integrity, event});
        script.src = src;
        script.async = true;
        if (integrity) {
            script.integrity = integrity;
            script.crossOrigin = "anonymous";
        }
        document.body.append(script);
    });
}

/**
 * `chunkSize` is 65536, ReadableStream uses the same size.
 * There is no speed difference between using of different the chunk's sizes.
 * @param {ArrayBuffer|Uint8Array} arrayBuffer
 * @param {Number} [chunkSize=65536]
 * @return {Generator<Uint8Array>}
 */
export function *iterateArrayBuffer(arrayBuffer, chunkSize = 65536) {
    const buffer = new Uint8Array(arrayBuffer);
    let index = 0;
    while (true) {
        const chunk = buffer.subarray(index, index + chunkSize);
        if (!chunk.length) {
            break;
        }
        yield chunk;
        index += chunkSize;
    }
}

/**
 * @param {Response|ReadableStream|Blob} dataSource
 * @return {AsyncGenerator<Uint8Array>}
 */
export async function *iterateAsyncDataSource(dataSource) {
    if (dataSource instanceof Response) {
        dataSource = dataSource.body;
    }
    if (dataSource instanceof ReadableStream) {
        yield *iterateReadableStream(dataSource);
    } else if (dataSource instanceof Blob) {
        for (const part of iterateBlob(dataSource)) {
            yield await part;
        }
    }
}


/**
 * @param {ReadableStream} stream
 * @return {AsyncGenerator<Uint8Array>}
 */
export async function *iterateReadableStream(stream) {
    const reader = stream.getReader();
    while (true) {
        const {done, /** @type {Uint8Array} */ value} = await reader.read();
        if (done) {
            break;
        }
        yield value;
    }
}

/**
 * Iterates Blob (or File).
 * Note: `chunkSize` affects the execution speed
 * @param {Blob} blob
 * @param {Number} [chunkSize=2097152]
 * @return {Generator<Promise<Uint8Array>>|AsyncGenerator<Uint8Array>}
 */
export function *iterateBlob(blob, chunkSize = 2 * 1024 * 1024) {
    let index = 0;
    while (true) {
        const blobChunk = blob.slice(index, index + chunkSize);
        if (!blobChunk.size) {break;}

        yield read(blobChunk);
        index += chunkSize;
    }

    async function read(blob) {
        return new Uint8Array(await blob.arrayBuffer());
    }
}

/**
 * Format bytes to human readable format.
 * Trims the tailing zeros.
 *
 * {@link https://stackoverflow.com/a/18650828/11468937}
 * @param {Number} bytes
 * @param {Number} [decimals=2]
 * @returns {String}
 */
export function bytesToSize(bytes, decimals = 2) {
    if (bytes === 0) { return "0 B"; }
    const k = 1024;
    decimals = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}

/**
 * Formats bytes mostly like Windows does,
 * but in some rare cases the result is different.
 * Check the file with tests.
 * @see win-like-file-sizes.test.js
 * @param {Number} bytes
 * @return {string}
 */
export function bytesToSizeWinLike(bytes) {
    if (bytes < 1024) { return bytes + " B"; }
    const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let i = Math.floor(Math.log(bytes) / Math.log(1024));
    let result = bytes / Math.pow(1024, i);
    if (result >= 1000) {
        i++;
        result /= 1024;
    }
    return toTruncPrecision3(result) + " " + sizes[i];
}

/**
 * @see trunc-with-precision-3.test.js
 * @param {Number} number
 * @return {string}
 */
export function toTruncPrecision3(number) {
    let result;
    if (number < 10) {
        result = Math.trunc(number * 100) / 100;
    } else if (number < 100) {
        result = Math.trunc(number * 10) / 10;
    } else if (number < 1000) {
        result = Math.trunc(number);
    }
    if (number < 0.1) {
        return result.toPrecision(1);
    } else if (number < 1) {
        return result.toPrecision(2);
    }
    return result.toPrecision(3);
}

/**
 * @param {Uint8Array[]} arrays
 * @return {Uint8Array}
 */
export function concat(arrays) {
    const totalLength = arrays.reduce((acc, value) => acc + value.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const array of arrays) {
        result.set(array, offset);
        offset += array.length;
    }
    return result;
}
