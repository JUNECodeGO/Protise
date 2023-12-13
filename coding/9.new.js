/** @format */

function myNew(fn, ...args) {
  var _obj = Object.create(fn.prototype);
  var _result = fn.call(_obj, ...args);
  return _result ? _result : _obj;
}
