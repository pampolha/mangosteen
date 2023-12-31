/* eslint-disable no-magic-numbers */
function fastDoublingFib(n) {
  if (n < 0) throw new Error("Negative arguments are not supported.");
  if (n === 0) return 0;
  if (n === 1) return 1;
  let [a, b] = [0, 1];
  for (let i = 31 - Math.clz32(n); i >= 0; i--) {
    const [aa, bb] = [a * (2 * b - a), a * a + b * b];
    a = aa;
    b = bb;
    if (((n >>> i) & 1) !== 0) {
      [a, b] = [b, a + b];
    }
  }
  return a;
}

function recursiveFib(n) {
  if (n < 2) {
    return n;
  } else {
    return recursiveFib(n - 1) + recursiveFib(n - 2);
  }
}

setInterval(() => {
  console.time("logtime");
  fastDoublingFib(Number.MAX_SAFE_INTEGER);
  recursiveFib(34);
  recursiveFib(39);
  console.timeEnd("logtime");
}, 1000);
