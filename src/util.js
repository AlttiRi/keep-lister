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
    const {ext} = filename.match(/(?<ext>[^\.]+)$/).groups;
    return videoExtensions.includes(ext);
}
const imageExtensions = ["png", "jpg", "jpeg", "gif", "tiff", "webp"];
export function isImage(filename) {
    const {ext} = filename.match(/(?<ext>[^\.]+)$/).groups;
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
    function pad(str) {
        return str.toString().padStart(2, "0");
    }
    const _utc = utc ? "UTC" : ""; // 2021.01.10 UTC support
    const year  = _date[`get${_utc}FullYear`]();
    const month = _date[`get${_utc}Month`]() + 1;
    const date  = _date[`get${_utc}Date`]();

    // if server error (or missed)
    if (Number(_date) === 0) {
        console.warn("date is 1970.01.01"); // todo use colored console.log
        return ""; // new 2021.03.08
    }

    return year + "." + pad(month) + "." + pad(date);
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
