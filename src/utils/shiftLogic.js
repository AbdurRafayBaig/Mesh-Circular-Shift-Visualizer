/**
 * shiftLogic.js — Pure circular q-shift algorithm for 2D mesh topology.
 *
 * Circular q-shift: node i sends data to node (i + q) mod p
 * On a 2D mesh this decomposes into two stages:
 *   Stage 1 (Row):    shift each row right by  (q mod √p)
 *   Stage 2 (Column): shift each column down by ⌊q / √p⌋
 */

/**
 * Check whether n is a perfect square.
 * @param {number} n
 * @returns {boolean}
 */
export function isPerfectSquare(n) {
  if (n < 1) return false;
  const root = Math.round(Math.sqrt(n));
  return root * root === n;
}

/**
 * Build the initial data array where node i holds data value i.
 * @param {number} p  total number of nodes
 * @returns {number[]}
 */
export function buildInitialState(p) {
  return Array.from({ length: p }, (_, i) => i);
}

/**
 * Perform Stage 1 — circular row shift.
 * Each row of length n is shifted RIGHT by `rowShift` positions.
 *
 * @param {number[]} data   flat array of length p
 * @param {number}   n      side length (√p)
 * @param {number}   rowShift  number of positions to shift right
 * @returns {number[]}  new array after row-shift
 */
export function applyRowShift(data, n, rowShift) {
  const result = new Array(data.length);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const srcIdx = r * n + c;
      const destCol = (c + rowShift) % n;
      const destIdx = r * n + destCol;
      result[destIdx] = data[srcIdx];
    }
  }
  return result;
}

/**
 * Perform Stage 2 — circular column shift.
 * Each column of length n is shifted DOWN by `colShift` positions.
 *
 * @param {number[]} data   flat array of length p
 * @param {number}   n      side length (√p)
 * @param {number}   colShift  number of positions to shift down
 * @returns {number[]}  new array after column-shift
 */
export function applyColShift(data, n, colShift) {
  const result = new Array(data.length);
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const srcIdx = r * n + c;
      const destRow = (r + colShift) % n;
      const destIdx = destRow * n + c;
      result[destIdx] = data[srcIdx];
    }
  }
  return result;
}

/**
 * Compute the full circular q-shift on a 2D mesh of p nodes.
 *
 * @param {number} p  total nodes (must be a perfect square, 4–64)
 * @param {number} q  shift amount (1 to p-1)
 * @returns {{
 *   initial:    number[],
 *   afterRow:   number[],
 *   afterCol:   number[],
 *   rowShift:   number,
 *   colShift:   number,
 *   n:          number
 * }}
 */
export function computeShift(p, q) {
  const n = Math.round(Math.sqrt(p));
  const rowShift = q % n;
  const colShift = Math.floor(q / n);

  const initial = buildInitialState(p);
  const afterRow = applyRowShift(initial, n, rowShift);
  const afterCol = applyColShift(afterRow, n, colShift);

  return { initial, afterRow, afterCol, rowShift, colShift, n };
}

/**
 * Complexity comparison between mesh and ring topologies.
 *
 * @param {number} p
 * @param {number} q
 * @returns {{
 *   rowShiftAmount: number,
 *   colShiftAmount: number,
 *   meshSteps:      number,
 *   ringSteps:      number,
 *   n:              number
 * }}
 */
export function computeComplexity(p, q) {
  const n = Math.round(Math.sqrt(p));
  const rowShiftAmount = q % n;
  const colShiftAmount = Math.floor(q / n);
  const meshSteps = rowShiftAmount + colShiftAmount;
  const ringSteps = Math.min(q, p - q);

  return { rowShiftAmount, colShiftAmount, meshSteps, ringSteps, n };
}
