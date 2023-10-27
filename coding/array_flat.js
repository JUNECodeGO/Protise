/** @format */

function flat(target) {
  return target.reduce((a, b) => a.concat(!Array.isArray(b) ? b : flat(b)), []);
}
