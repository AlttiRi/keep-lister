const _ANSI_RESET = "\u001B[0m";
/** @typedef {"black"|"red"|"green"|"yellow"|"blue"|"magenta"|"cyan"|"white"} ANSIColor */
/** @type {Map<ANSIColor, number>} */
const ansiColorsMap = new Map([
    ["black",   30],
    ["red",     31],
    ["green",   32],
    ["yellow",  33],
    ["blue",    34],
    ["magenta", 35],
    ["cyan",    36],
    ["white",   37],
]);
/**
 * https://en.wikipedia.org/wiki/ANSI_escape_code
 * "32" - Green [ANSI]
 * "36" - Cyan  [ANSI]
 * "38;5;208" - Orange #ff8700 [8-bit]
 * "38;5;99"  - Violet #875fff [8-bit]
 * "38;2;173;255;47" - Green-Yellow #adff2f [24-bit]
 * @param {String} mode
 * @return {function(text: any): String}
 */
export function getColoring(mode) {
    return text => `\u001B[${mode}m${text}${_ANSI_RESET}`;
}
/**
 * @param {ANSIColor} [color="white"]
 * @param {Object} [opts]
 * @param {Boolean} [opts.bright=false]
 * @param {Boolean} [opts.bold=false]
 * @return {function(text: any): String}
 */
export function getAnsiColoring(color = "white", opts= {}) {
    const {bright, bold} = Object.assign({bright: false, bold: false}, opts);
    let num = ansiColorsMap.get(color);
    if (bright) {
        num += 60;
    }
    const boldStr = bold ? "1;" : "";
    const colorMod = `${boldStr}${num}`;
    return getColoring(colorMod);
}
// Some predefined colors
export const ANSI_BLUE  = /*#__PURE__*/ getAnsiColoring("blue");
export const ANSI_CYAN  = /*#__PURE__*/ getAnsiColoring("cyan");
export const ANSI_GREEN = /*#__PURE__*/ getAnsiColoring("green");
export const ANSI_GRAY  = /*#__PURE__*/ getAnsiColoring("black", {bright: true});
export const ANSI_GREEN_BOLD = /*#__PURE__*/ getAnsiColoring("green", {bold: true});
export const ANSI_RED_BOLD   = /*#__PURE__*/ getAnsiColoring("red",   {bold: true});

export const saveCursorPosition    = () => process.stdout.write("\u001B[s");
export const restoreCursorPosition = () => process.stdout.write("\u001B[u");
export const eraseCursorLine       = () => process.stdout.write("\u001B[K");
export const moveCursorToTop = (num = 1) => process.stdout.write(`\u001B[${num}A`);
