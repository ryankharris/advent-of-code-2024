import { parse } from "@std/csv/parse";

function topologicalSort(rules, update) {
    const graph = new Map();
    const inDegree = new Map();

    // Build the graph and in-degree map
    rules.forEach(rule => {
        const [u, v] = rule.split('|').map(Number);
        if (update.includes(u) && update.includes(v)) {
            if (!graph.has(u)) graph.set(u, []);
            graph.get(u).push(v);
            inDegree.set(v, (inDegree.get(v) || 0) + 1);
            if (!inDegree.has(u)) inDegree.set(u, 0);
        }
    });

    // Initialize the queue with nodes having zero in-degree
    const queue = [];
    inDegree.forEach((degree, node) => {
        if (degree === 0) queue.push(node);
    });

    const order = [];
    while (queue.length > 0) {
        const node = queue.shift();
        order.push(node);
        if (graph.has(node)) {
            graph.get(node).forEach(neighbor => {
                inDegree.set(neighbor, inDegree.get(neighbor) - 1);
                if (inDegree.get(neighbor) === 0) queue.push(neighbor);
            });
        }
    }

    // Check for cycles
    if (order.length !== inDegree.size) {
        return "Cycle detected, no valid ordering possible";
    }

    return order;
}

function isCorrectOrder(update, order) {
    console.log('update:', update);
    console.log('order:', order);
    const indexMap = new Map(order.map((page, index) => [page, index]));
    for (let i = 0; i < update.length - 1; i++) {
        if (indexMap.get(update[i]) > indexMap.get(update[i + 1])) {
            return false;
        }
    }
    return true;
}

function findMiddlePage(update) {
    const n = update.length;
    return n % 2 === 1 ? update[Math.floor(n / 2)] : [update[n / 2 - 1], update[n / 2]];
}

// Example input
// const rules = [
//     "47|53", "97|13", "97|61", "97|47", "75|29", "61|13", "75|53",
//     "29|13", "97|29", "53|29", "61|53", "97|53", "61|29", "47|13",
//     "75|47", "97|75", "47|61", "75|61", "47|29", "75|13", "53|13"
// ];

// const updates = [
//     [75, 47, 61, 53, 29],
//     [97, 61, 53, 29, 13],
//     [75, 29, 13],
//     [75, 97, 47, 61, 53],
//     [61, 13, 29],
//     [97, 13, 75, 29, 47]
// ];

const srcInput = await Deno.readTextFile("./Input/puzzleInput.txt");
const data = parse(srcInput, {
  skipFirstRow: false,
  separator: " ",
  trimLeadingSpace: true,
});
const rules: string[] = [];
const updates: string[] = [];
data.forEach((arrayOfThing) => {
  if (arrayOfThing[0].includes("|")) {
    rules.push(arrayOfThing[0]);
  } else {
    updates.push(arrayOfThing[0].split(',').map(x => Number(x)));
  }
});

// console.log("orderRules:", rules);
// console.log("updates:", updates);

// Check each update and find the middle page number for correctly-ordered updates
const correctUpdates = [];
const middlePages = [];

updates.forEach(update => {
    const topoOrder = topologicalSort(rules, update);
    if (topoOrder === "Cycle detected, no valid ordering possible") {
        console.log(`Update ${update} has a cycle and no valid ordering is possible.`);
    } else if (isCorrectOrder(update, topoOrder)) {
        const middlePage = findMiddlePage(update);
        correctUpdates.push(update);
        middlePages.push(middlePage);
        // console.log(`Update ${update} is in the correct order. Middle page: ${middlePage}`);
    } else {
        // console.log(`Update ${update} is NOT in the correct order.`);
    }
});
console.log('correctUpdates:', correctUpdates.length);

// Calculate the sum of the middle page numbers
const middlePageSum = middlePages.flat().reduce((sum, page) => sum + page, 0);
console.log(`Sum of middle page numbers from correctly-ordered updates: ${middlePageSum}`);
