/** @format */

function trim(str) {
  if (typeof str !== 'string') {
    throw Error();
  }
  return str.replace(/^\s+|\s+$/g, '');
}
