// Solution to Day2 - Red Nosed Reports
// run with:
// deno run --allow-read ./main.ts

import { parse } from "@std/csv/parse";

export {};

const srcInput = await Deno.readTextFile("./Input/puzzleInput.txt");
const data = parse(srcInput, { skipFirstRow: false, separator: " ", trimLeadingSpace: true });

const recurIsSafeInc = (partialReport: string[]): boolean => {
    if (partialReport.length === 1) {
        return true;
    }
    const [head, ...rest] = partialReport;
    const a = Number(head);
    const b = Number(rest[0])
    const isInc = a < b;
    const step = Math.abs(a - b);
    const isStepSafe = 1 <= step && step <= 3;
    return isInc && isStepSafe && recurIsSafeInc(rest);
};

const recurIsSafeDec = (partialReport: string[]): boolean => {
    if (partialReport.length === 1) {
        return true;
    }
    const [head, ...rest] = partialReport;
    const a = Number(head);
    const b = Number(rest[0])
    const isDec = a > b;
    const step = Math.abs(a - b);
    const isStepSafe = 1 <= step && step <= 3;
    return isDec && isStepSafe && recurIsSafeDec(rest);
};

const validateIsSafe = (report: string[]): boolean => {
    return recurIsSafeInc(report) || recurIsSafeDec(report);
};

const validateIsSafeWithDampner = (report: string[]): boolean => {
    const isSafe = validateIsSafe(report);
    if (isSafe) {
        return isSafe;
    }
    return report.some((_: string, index: number, _report: string[]) => {
        const dampenedReport = Array.from(_report);
        dampenedReport.splice(index, 1);
        return validateIsSafe(dampenedReport);
    });
};

const safeReportCountPart1 = data.reduce((safeCount: number, currReport: string[]) => {
    const isSafe = validateIsSafe(currReport);
    return isSafe ? safeCount + 1 : safeCount;
}, 0);

console.log('part 1, number of safe reports: ', safeReportCountPart1);

const safeReportCountPart2 = data.reduce((safeCount: number, currReport: string[]) => {
    const isSafe = validateIsSafeWithDampner(currReport);
    return isSafe ? safeCount + 1 : safeCount;
}, 0);

console.log('part 2, number of safe reports: ', safeReportCountPart2);
