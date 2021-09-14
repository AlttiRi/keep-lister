import {ANSI_GREEN, ANSI_RED_BOLD} from "../scanner/util-node.js";

export class Tester {
    constructor() {
        this.passed = [];
        this.failed = [];
    }
    destructible() {
        return {
            eq: this.eq.bind(this),
            report: this.report.bind(this),
        }
    }
    eq(name, result, expected) {
        if (result === expected) {
            this.passed.push(name);
            console.log(ANSI_GREEN(`Test ${name} passed`));
            console.log("Result   : ", result);
            console.log("Expected : ", expected);
            console.log("---");
        } else {
            this.failed.push(name);
            console.log(ANSI_RED_BOLD(`Test ${name} failed`));
            console.log("Result   : ", result);
            console.log("Expected : ", expected);
            console.log("---");
        }
    }
    report() {
        console.log();
        console.log(`Failed ${this.failed.length}`);
        console.log(`Passed ${this.passed.length}`);
    }
}
