/** @format */

function isEqual(targetA, targetB) {
  if (targetA === targetB) return true;
  if (isNaN(targetA) && isNaN(targetB)) return true;
  if (targetA !== null && targetB !== null) {
    for (let key in targetA) {
      if (isEqual(targetA[key] === targetB[key])) return true;
      return false;
    }
  }

  return false;
}
