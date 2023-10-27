/** @format */

function IsArray(target) {
  if (Object.prototype.toString.call(target) === '[object Array]') return true;
  return false;
}
