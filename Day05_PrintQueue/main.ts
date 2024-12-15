// Solution to Day5 - Print Queue
// run with:
// deno run --allow-read ./main.ts

import { parse } from "@std/csv/parse";

export {};

const srcInput = await Deno.readTextFile("./Input/puzzleInput.txt");
const data = parse(srcInput, {
  skipFirstRow: false,
  separator: " ",
  trimLeadingSpace: true,
});
const orderRules: string[] = [];
const updates: string[][] = [];
data.forEach((arrayOfThing) => {
  if (arrayOfThing[0].includes("|")) {
    orderRules.push(arrayOfThing[0]);
  } else {
    updates.push(arrayOfThing[0].split(','));
  }
});

const filterRules = (update: string[]): string[] => {
    return orderRules.filter(orderRule => {
        const [page1, page2] = orderRule.split('|');
        return update.includes(page1) && update.includes(page2);
    });
};

const buildOrderMap = (rules: string[]) => {
    const m = new Map();
    rules.forEach(rule => {
        const [page1, page2] = rule.split('|');
        if (!m.has(page1)) {
            m.set(page1, []);
        }
        m.get(page1).push(page2);
    });
    return m;
};

const sortIt = (orderMap, a, b): number => {
    if ((orderMap.get(a) || []).includes(b)) {
        return -1;
    } else if ((orderMap.get(b) || []).includes(a)) {
        return 1;
    } else {
        return 0;
    }
};

const processInvalid = (update: string[], rules: string[]): number => {
    const orderMap = buildOrderMap(rules);
    const boundSortIt = sortIt.bind(null, orderMap);
    const sortedUpdate = update.toSorted(boundSortIt);
    const midNum = Number(sortedUpdate[Math.floor(sortedUpdate.length / 2)]);
    return midNum;
};

let result2 = 0;
const result1 = updates.reduce((acc, update) => {
    const rules = filterRules(update);
    const m = new Map();
    update.forEach((page, index) => m.set(page, index));
    const isValid = rules.every(rule => {
        const [page1, page2] = rule.split('|');
        return m.get(page1) < m.get(page2);
    });
    if (isValid) {
        return acc + Number(update[Math.floor(update.length / 2)]);
    } else {
        result2 = result2 + processInvalid(update, rules);
    }
    return acc;
}, 0);


console.log('result1:', result1);
console.log('result2:', result2);
