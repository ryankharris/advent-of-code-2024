// Solution to Day1 - Historian Hysteria
// run with:
// deno run --allow-read ./main.ts 

import { parse } from "@std/csv/parse";

export {};

const srcInput = await Deno.readTextFile("./Input/puzzleInput.txt");
const data = parse(srcInput, { skipFirstRow: false, separator: " ", trimLeadingSpace: true });
const listA: string[] = [];
const listB: string[] = [];
data.forEach(record => {
    listA.push(record[0]);
    listB.push(record[1]);
});
listA.sort();
listB.sort();

const diffs = listA.map((locationIdA, index) => {
    const locationIdB = listB[index];
    return Math.abs(Number(locationIdA) - Number(locationIdB));
});

const result1 = diffs.reduce((acc, curr) => acc + curr);
console.log('part 1 result:', result1);

// part 2
const coefficientMap = new Map();
listB.forEach(locationIdB => {
    if (!coefficientMap.has(locationIdB)) {
        coefficientMap.set(locationIdB, 1);
    } else {
        const currentCount = coefficientMap.get(locationIdB);
        coefficientMap.set(locationIdB, currentCount + 1);
    }
});

const result2 = listA.reduce((acc, curr) => {
    const coefficient = coefficientMap.get(curr) || 0;
    return acc + Number(curr) * coefficient;
}, 0);
console.log('part 2 result:', result2);
