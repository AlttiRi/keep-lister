export const setImmediate = /*#__PURE__*/ (function() {
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
export const {compare} = new Intl.Collator(undefined, {
    numeric: true,
    sensitivity: "accent",
});

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
