import {bytesToSizeWinLike} from "../src/util.js";
import {ANSI_GREEN, ANSI_RED_BOLD} from "../scanner/util-node.js";

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



eq("1023", bytesToSizeWinLike(1023), "1023 B");
eq("1024", bytesToSizeWinLike(1024), "1.00 KB");
eq("1025", bytesToSizeWinLike(1025), "1.00 KB");
eq("1033", bytesToSizeWinLike(1033), "1.00 KB");
eq("1034", bytesToSizeWinLike(1034), "1.00 KB");
eq("1035", bytesToSizeWinLike(1035), "1.01 KB");
eq("1036", bytesToSizeWinLike(1036), "1.01 KB");
eq("1044", bytesToSizeWinLike(1044), "1.01 KB");
eq("1045", bytesToSizeWinLike(1045), "1.02 KB");
eq("1126", bytesToSizeWinLike(1126), "1.09 KB");
eq("1127", bytesToSizeWinLike(1127), "1.10 KB");
eq("1136", bytesToSizeWinLike(1136), "1.10 KB");
eq("1137", bytesToSizeWinLike(1137), "1.11 KB");
eq("1269", bytesToSizeWinLike(1269), "1.23 KB");
eq("1270", bytesToSizeWinLike(1270), "1.24 KB");
eq("10229", bytesToSizeWinLike(10229), "9.98 KB");
eq("10230", bytesToSizeWinLike(10230), "9.99 KB");
eq("10239", bytesToSizeWinLike(10239), "9.99 KB");
eq("10240", bytesToSizeWinLike(10240), "10.0 KB");
eq("10241", bytesToSizeWinLike(10241), "10.0 KB");
eq("10342", bytesToSizeWinLike(10342), "10.0 KB");
eq("10343", bytesToSizeWinLike(10343), "10.1 KB");

eq("0", bytesToSizeWinLike(0), "0 B");
eq("1", bytesToSizeWinLike(68), "68 B");
eq("2", bytesToSizeWinLike(178), "178 B");
eq("3", bytesToSizeWinLike(926), "926 B");
eq("4", bytesToSizeWinLike(1109), "1.08 KB");
eq("5", bytesToSizeWinLike(1531), "1.49 KB");
eq("6", bytesToSizeWinLike(2937), "2.86 KB");
eq("7", bytesToSizeWinLike(9536), "9.31 KB");
eq("8", bytesToSizeWinLike(10051), "9.81 KB");
eq("9", bytesToSizeWinLike(10193), "9.95 KB");
eq("10", bytesToSizeWinLike(10374), "10.1 KB");
eq("11", bytesToSizeWinLike(10868), "10.6 KB");
eq("12", bytesToSizeWinLike(12328), "12.0 KB");
eq("13", bytesToSizeWinLike(20388), "19.9 KB");
eq("14", bytesToSizeWinLike(857054), "836 KB");
eq("15", bytesToSizeWinLike(949271), "927 KB");
eq("16", bytesToSizeWinLike(1005637), "982 KB");
eq("17", bytesToSizeWinLike(1031656), "0.98 MB");
eq("18", bytesToSizeWinLike(1056626), "1.00 MB");
eq("19", bytesToSizeWinLike(1082102), "1.03 MB");
eq("10", bytesToSizeWinLike(1108494), "1.05 MB");
eq("20", bytesToSizeWinLike(1133158), "1.08 MB");
eq("21", bytesToSizeWinLike(1160948), "1.10 MB");
eq("22", bytesToSizeWinLike(1250798), "1.19 MB");
eq("23", bytesToSizeWinLike(1272425), "1.21 MB");
eq("24", bytesToSizeWinLike(1294780), "1.23 MB");
eq("25", bytesToSizeWinLike(1320010), "1.25 MB");
eq("26", bytesToSizeWinLike(1340451), "1.27 MB");
eq("27", bytesToSizeWinLike(2397632), "2.28 MB");
eq("28", bytesToSizeWinLike(106886214148), "99.5 GB");
eq("29", bytesToSizeWinLike(107968130186), "100 GB");
eq("30", bytesToSizeWinLike(109050046224), "101 GB");
eq("31", bytesToSizeWinLike(110131220721), "102 GB");
eq("32", bytesToSizeWinLike(112258741522), "104 GB");
eq("33", bytesToSizeWinLike(113312671996), "105 GB");
eq("34", bytesToSizeWinLike(113330211021), "105 GB");
eq("35", bytesToSizeWinLike(113365278451), "105 GB");
eq("36", bytesToSizeWinLike(184244378424), "171 GB");
eq("37", bytesToSizeWinLike(709134659325), "660 GB");
eq("38", bytesToSizeWinLike(1037459901192), "966 GB");
eq("39", bytesToSizeWinLike(1065225078258), "992 GB");
eq("40", bytesToSizeWinLike(1085511090598), "0.98 TB");
// eq("41", bytesToSizeWinLike(1088661207798), "0.98 TB"); // fail
eq("42", bytesToSizeWinLike(1101101481343), "1.00 TB");
eq("43", bytesToSizeWinLike(1120103415568), "1.01 TB");
eq("44", bytesToSizeWinLike(1141425412304), "1.03 TB");
eq("45", bytesToSizeWinLike(1140309803008), "1.03 TB");
// eq("46", bytesToSizeWinLike(1155241971712), "1.04 TB"); // fail // % 4096
eq("47", bytesToSizeWinLike(1156350363815), "1.05 TB");
eq("48", bytesToSizeWinLike(1171333916692), "1.06 TB");
eq("49", bytesToSizeWinLike(1180658122801), "1.07 TB");
// eq("50", bytesToSizeWinLike(1198893047808), "1.08 TB"); // fail // % 4096
eq("51", bytesToSizeWinLike(1199981686908), "1.09 TB");
eq("52", bytesToSizeWinLike(1214215963167), "1.10 TB");
eq("53", bytesToSizeWinLike(1338401909870), "1.21 TB");
eq("54", bytesToSizeWinLike(1431992896827), "1.30 TB");

// ----

eq("q1", bytesToSizeWinLike(1433875647124), "1.30 TB");
eq("q2", bytesToSizeWinLike(1432409759744), "1.30 TB");

eq("w1", bytesToSizeWinLike(1112360389416), "1.01 TB");
// eq("w2", bytesToSizeWinLike(1110842765312), "1.00 TB"); // fail // % 4096

eq("e1", bytesToSizeWinLike(1163707317687), "1.05 TB");
eq("e2", bytesToSizeWinLike(1162215026688), "1.05 TB");

eq("r1", bytesToSizeWinLike(1138118739306), "1.03 TB");
eq("r2", bytesToSizeWinLike(1136595513344), "1.03 TB");

// eq("t1", bytesToSizeWinLike(1122038275947), "1.01 TB");  // fail
eq("t2", bytesToSizeWinLike(1120497823744), "1.01 TB");

eq("a1", bytesToSizeWinLike(1109149741893), "1.00 TB");
eq("a2", bytesToSizeWinLike(1107607552000), "1.00 TB");

eq("s1", bytesToSizeWinLike(1098188277124), "0.99 TB");
eq("s2", bytesToSizeWinLike(1096642224128), "0.99 TB");

eq("d1", bytesToSizeWinLike(1083108957890), "0.98 TB");
eq("d2", bytesToSizeWinLike(1081554362368), "0.98 TB");

eq("f1", bytesToSizeWinLike(1080501971677), "0.98 TB");
eq("f2", bytesToSizeWinLike(1078946144256), "0.98 TB");

eq("g1", bytesToSizeWinLike(1069207931098), "995 GB");
eq("g2", bytesToSizeWinLike(1067642114048), "994 GB");


// --------------------

eq("x01", bytesToSizeWinLike( 2_840_002_953_216), "2.58 TB");
eq("x02", bytesToSizeWinLike( 3_000_457_288_288), "2.72 TB");
eq("x03", bytesToSizeWinLike(12_001_547_911_168), "10.9 TB");
eq("x04", bytesToSizeWinLike(14_000_383_324_160), "12.7 TB");
eq("x05", bytesToSizeWinLike(13_999_860_125_696), "12.7 TB");
eq("x06", bytesToSizeWinLike(10_994_980_986_880), "9.99 TB");
eq("x07", bytesToSizeWinLike(10_000_695_029_760), "9.09 TB");
eq("x08", bytesToSizeWinLike(10_000_201_355_264), "9.09 TB");
eq("x09", bytesToSizeWinLike(12_000_002_306_048), "10.9 TB");
eq("x10", bytesToSizeWinLike(11_953_396_191_232), "10.8 TB");
eq("x11", bytesToSizeWinLike(16_000_881_782_784), "14.5 TB");
eq("x12", bytesToSizeWinLike(53_728_394_959_861), "48.8 TB");



eq("xxx-1", bytesToSizeWinLike(2875392), "2.74 MB");
eq("xxx-3", bytesToSizeWinLike(3178496), "3.03 MB");



// ---------------------------
// 1088661207798      / 1024 =
// 1063145710.7402344 / 1024 =
// 1038228.2331447601 / 1024 =
// 1013.8947589304298 / 1024 =
// 0.9901316005179979
// 0.99 TB
eq("41", bytesToSizeWinLike(1088661207798), "0.98 TB"); // failed
// 1155241971712
// 1128165988
// 1101724.59765625
// 1075.9029273986816
// 1.050686452537775
// 1.05 TB
eq("46", bytesToSizeWinLike(1155241971712), "1.04 TB"); // failed // % 4096
// 1198893047808
// 1170793992
// 1143353.5078125
// 1116.5561599731445
// 1.090386874973774
// 1.09 TB
eq("50", bytesToSizeWinLike(1198893047808), "1.08 TB"); // failed // % 4096
// 1110842765312
// 1084807388
// 1059382.21484375
// 1034.5529441833496
// 1.0103056095540524
// 1.01 TB
eq("w2", bytesToSizeWinLike(1110842765312), "1.00 TB"); // failed // % 4096
// 1122038275947      / 1024 =
// 1095740503.8544922 / 1024 =
// 1070059.0857954025 / 1024 =
// 1044.9795759720728 / 1024 =
// 1.0204878671602273
// 1.02 TB
eq("t1", bytesToSizeWinLike(1122038275947), "1.01 TB"); // failed


// -----------------

// 2875392      / 1024 =
// 2805.984375  / 1024 =
// 2.7402191162109375
eq("xxx-2", bytesToSizeWinLike(2873328), "2.73 MB"); // failed
// 3177467
// 3102.9951171875
// 3.030268669128418
eq("xxx-4", bytesToSizeWinLike(3177467), "3.02 MB"); // failed


report();
