import {ANSI_GREEN, ANSI_RED_BOLD, toTruncPrecision3} from "../scanner/util-node.js";

const passed = [];
const failed = [];
function eq(name, result, expected) {
    if (result === expected) {
        passed.push(name);
        console.log(ANSI_GREEN(`Test ${name} passed`));
        console.log("Result   : ", result);
        console.log("Expected : ", expected);
        console.log("---");
    } else {
        failed.push(name);
        console.log(ANSI_RED_BOLD(`Test ${name} failed`));
        console.log("Result   : ", result);
        console.log("Expected : ", expected);
        console.log("---");
    }
}
function report() {
    console.log();
    console.log(`Failed ${failed.length}`);
    console.log(`Passed ${passed.length}`);
}



eq("1", toTruncPrecision3(10.1005859375), "10.1");
eq("2", toTruncPrecision3(10.0996093750), "10.0");
eq("3", toTruncPrecision3(9.99902343750), "9.99");
eq("4", toTruncPrecision3(9.98925781250), "9.98");
eq("5", toTruncPrecision3(1.23925781250), "1.23");
eq("6", toTruncPrecision3(1.10937500000), "1.10");
eq("7", toTruncPrecision3(836.966796875), "836");
eq("8", toTruncPrecision3(0.08), "0.08");
eq("9", toTruncPrecision3(0.099), "0.09");




report();
