import t from "ava"; const test = t;
import {comparator, shuffle} from "../src/util.js";



test("1", t => {
    const data   = ["1", "2", "3"];
    const expect = ["1", "2", "3"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("2", t => {
    const data   = ["3", "2", "1"];
    const expect = ["1", "2", "3"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("3", t => {
    const data   = ["a", "c", "b"];
    const expect = ["a", "b", "c"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("4", t => {
    const data   = ["a", "c", "b", "b"];
    const expect = ["a", "b", "b", "c"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("5", t => {
    const data   = ["#q1.txt", "[q2].txt", "[q1].txt"];
    const expect = ["#q1.txt", "[q1].txt", "[q2].txt"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("6", t => {
    const data   = ["q1.txt", "[q2].txt", "#q1.txt", "[q1].txt"];
    const expect = ["#q1.txt", "[q1].txt", "[q2].txt", "q1.txt"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("7", t => {
    const data   = ["Щ", "Й", "Ё", "Е", "ии", "И"];
    const expect = ["Е", "Ё", "И", "ии", "Й", "Щ"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("8", t => {
    const data   = ["~", "{}", "mmm", "aaa", "Art", "#temp", "MEGA", "!!!", "_do", "[g-dl]"];
    const expect = ["!!!", "#temp", "[g-dl]", "_do", "{}", "~", "aaa", "Art", "MEGA", "mmm"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("9", t => {
    const data   = ["[q1]", "#q1", "q11", "q3", "[q2]", "q1", "q2"];
    const expect = ["#q1", "[q1]", "[q2]", "q1", "q2", "q3", "q11"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("10", t => {
    const data   = ["ИИ", "М", "МмМ", "и", "иИи", "мм"];
    const expect = ["и", "ИИ", "иИи", "М", "мм", "МмМ"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});


test("11", t => {
    const data   = ["ии", "й","И","Е", "ё","её", "ёе", "ее",];
    const expect = ["Е", "ё", "ее", "её", "ёе", "И", "ии", "й"];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});


test("13", t => {
    const data   = ["q1", "q11","q12","q3", "q15", "q5",];
    const expect = ["q1", "q3", "q5", "q11", "q12", "q15",];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("14", t => {
    const data   = ["qwe ,io", "qwe, io", "qwe  io", "qwe io", "qwe , io",];
    const expect = ["qwe  io", "qwe , io", "qwe ,io", "qwe io", "qwe, io",];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("14-shuffle", t => {
    for (let i = 0; i < 10; i++) {
        const data   = ["qwe ,io", "qwe, io", "qwe  io", "qwe io", "qwe , io",].sort(shuffle);
        const expect = ["qwe  io", "qwe , io", "qwe ,io", "qwe io", "qwe, io",];
        const actual = data.sort(comparator);
        t.is(actual.toString(), expect.toString());
    }
});

test("15", t => {
    const data   = ["-a-", "-#-", "-'-", "-.-", "-!-", "---", "- -", "-;-", "-,-",];
    const expect = ["-'-", "---", "- -", "-!-", "-#-", "-,-", "-.-", "-;-", "-a-",];
    const actual = data.sort(comparator);
    t.is(actual.toString(), expect.toString());
});

test("16", t => {
    // as is in ascii
    const data   = [" ","!","#","$","%","&","'","(",")","+",",","-",".","0","1","9",";","=","@","a","z","[","]","^","_","`","{","}","~",];
    // as is in windows
    const expect = ["'","-"," ","!","#","$","%","&","(",")",",",".",";","@","[","]","^","_","`","{","}","~","+","=","0","1","9","a","z",];
    // as with Intl.Collator
    const intlCo = [" ","_","-",",",";","!",".","'","(",")","[","]","{","}","@","&","#","%","`","^","+","=","~","$","0","1","9","a","z",];

    const actual = data.sort(comparator);
    t.is(actual.join(" "), expect.join(" "));
});

/*
test("16-ascii-like", t => {
    // as is in ascii
    const data   = [" ","!","#","$","%","&","'","(",")","+",",","-",".","0","1","9",";","=","@","a","z","[","]","^","_","`","{","}","~",];
    // as is in ascii, but with moved [0-9] to [a-z]
    const expect = [" ","!","#","$","%","&","'","(",")","+",",","-",".",";","=","@","[","]","^","_","`","{","}","~","0","1","9","a","z",];
    const actual = data.sort(comparator);
    t.is(actual.join(" "), expect.join(" "));
});
*/














