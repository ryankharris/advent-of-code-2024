// Solution to Day4 - Ceres Search
// run with:
// deno run --allow-read ./main.ts

export {}

const srcInput = await Deno.readTextFile("./Input/puzzleInput.txt");
const data = srcInput.split("\r\n").filter((row) => row !== "").map((row) =>
  row.split("")
);

const getNextCoord = (
  xStep: number,
  yStep: number,
  xCurr: number,
  yCurr: number,
): [number, number] => {
  return [xCurr + xStep, yCurr + yStep];
};

const getNorth = getNextCoord.bind(null, 0, -1);
const getNorthEast = getNextCoord.bind(null, 1, -1);
const getEast = getNextCoord.bind(null, 1, 0);
const getSouthEast = getNextCoord.bind(null, 1, 1);
const getSouth = getNextCoord.bind(null, 0, 1);
const getSouthWest = getNextCoord.bind(null, -1, 1);
const getWest = getNextCoord.bind(null, -1, 0);
const getNorthWest = getNextCoord.bind(null, -1, -1);
const directions = [
  getNorth,
  getNorthEast,
  getEast,
  getSouthEast,
  getSouth,
  getSouthWest,
  getWest,
  getNorthWest,
];

const xmasScan = (
  thing: string,
  direction: Function,
  [x, y]: [number, number],
): boolean => {
  if (thing === "") {
    return true;
  }
  const searchFor = thing.slice(0, 1);
  const [xNext, yNext] = direction(x, y);
  const valNext = data?.[yNext]?.[xNext];
  if (valNext === undefined) {
    return false;
  } else if (valNext === searchFor) {
    return xmasScan(thing.slice(1), direction, [xNext, yNext]);
  }
  return false;
};

const getValAt = (x: number, y: number): string => {
  return data?.[y]?.[x];
};

const verifyMasX = ([xCurr, yCurr]: [number, number]): boolean => {
  const validVals = ["MS", "SM"];
  const nwCoords = getNorthWest(xCurr, yCurr);
  const seCoords = getSouthEast(xCurr, yCurr);
  const swCoords = getSouthWest(xCurr, yCurr);
  const neCoords = getNorthEast(xCurr, yCurr);
  const nwVal = getValAt(...nwCoords);
  const seVal = getValAt(...seCoords);
  const swVal = getValAt(...swCoords);
  const neVal = getValAt(...neCoords);
  if (nwVal && seVal && swVal && neVal) {
      const nw_se = nwVal + seVal;
      const sw_ne = swVal + neVal;
    return validVals.includes(nw_se) && validVals.includes(sw_ne);
  }
  return false;
};

let result1 = 0;
data.forEach((row: string[], y: number) => {
  row.forEach((col: string, x: number) => {
    if (col === "X") {
      const moreMatches = directions.reduce((acc, direction) => {
        const isMatch = xmasScan("MAS", direction, [x, y]);
        return isMatch ? acc + 1 : acc;
      }, 0);
      result1 = result1 + moreMatches;
    }
  });
});
console.log("result1:", result1);

let result2 = 0;
data.forEach((row: string[], y: number) => {
  row.forEach((col: string, x: number) => {
    if (col === "A") {
      const isMasX = verifyMasX([x, y]);
      if (isMasX) {
        result2++;
      }
    }
  });
});
console.log("result2:", result2);
