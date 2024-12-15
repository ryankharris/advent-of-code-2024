// Solution to Day3 - Mull It Over
// run with:
// deno run --allow-read ./main.ts

export { };

const srcInput = await Deno.readTextFile("./Input/puzzleInput.txt");
const re1 = /mul\((\d{1,3}),(\d{1,3})\)/g;
const matches1 = srcInput.matchAll(re1);
const result1 = matches1.reduce((acc: number, curr) => {
    const [_, a, b] = curr;
    const mTerm = Number(a) * Number(b);
    return acc + mTerm;
}, 0);
console.log('part 1 sum:', result1);

const re2 = /mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don\'t/g;
const matches2 = srcInput.matchAll(re2);
let doIt = true;
const result2 = matches2.reduce((acc: number, curr) => {
    const [op, a, b] = curr;

    if (op === 'do()') {
        doIt = true;
    } else if (op === "don't") {
        doIt = false;
    } else if (doIt) {
        const mTerm = Number(a) * Number(b);
        return acc + mTerm;
    }
    return acc;
}, 0);
console.log('part 2 sum:', result2);
