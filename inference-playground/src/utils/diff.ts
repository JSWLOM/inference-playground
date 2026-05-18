// LCS based token-level diff algorithm
// self written not used from any library

import type { TokenType } from '../components/DiffView/DiffToken';

export interface DiffResult {
  text: string;
  type: TokenType;
}

// dp table 
// dp[i][j] = length of LCS of first i words of A and first j words of B
function buildLCSTable(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;

  // 2D array initialize from zero
  const dp: number[][] = Array.from(
    { length: m + 1 },
    () => new Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
        // Words match from diagonals
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        // Words dont match max of top or left
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp;
}

// Backtrack from table to get diff results
function backtrack(
  dp: number[][],
  a: string[],
  b: string[],
  i: number,
  j: number,
  leftAcc: DiffResult[],
  rightAcc: DiffResult[]
): void {
  // Base case 
  if (i === 0 && j === 0) return;

  if (i === 0) {
    // A =removed rest in B = added
    backtrack(dp, a, b, i, j - 1, leftAcc, rightAcc);
    rightAcc.push({ text: b[j - 1], type: 'added' });
    return;
  }

  if (j === 0) {
    // B khatam — baaki sab A mein removed hai
    backtrack(dp, a, b, i - 1, j, leftAcc, rightAcc);
    leftAcc.push({ text: a[i - 1], type: 'removed' });
    return;
  }

  if (a[i - 1].toLowerCase() === b[j - 1].toLowerCase()) {
    // Same word- dono sides pe 'same'
    backtrack(dp, a, b, i - 1, j - 1, leftAcc, rightAcc);
    leftAcc.push({ text: a[i - 1], type: 'same' });
    rightAcc.push({ text: b[j - 1], type: 'same' });
  } else if (dp[i - 1][j] >= dp[i][j - 1]) {
    // A se remove
    backtrack(dp, a, b, i - 1, j, leftAcc, rightAcc);
    leftAcc.push({ text: a[i - 1], type: 'removed' });
  } else {
    // B mein add
    backtrack(dp, a, b, i, j - 1, leftAcc, rightAcc);
    rightAcc.push({ text: b[j - 1], type: 'added' });
  }
}

// Main function this will call from diff component
export function computeDiff(
  v1: string,
  v2: string
): { left: DiffResult[]; right: DiffResult[] } {
  // break in  Words
  const tokenize = (str: string) =>
    str.trim().split(/\s+/).filter(Boolean);

  const aWords = tokenize(v1);
  const bWords = tokenize(v2);

  const dp = buildLCSTable(aWords, bWords);

  const leftAcc: DiffResult[] = [];
  const rightAcc: DiffResult[] = [];

  backtrack(dp, aWords, bWords, aWords.length, bWords.length, leftAcc, rightAcc);

  return { left: leftAcc, right: rightAcc };
}