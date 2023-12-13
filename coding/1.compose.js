/**
 * 函数式编程
 *
 * @format
 */

compose([fn1, fn2, fn3])(1);
function compose(list) {
  var _fnList = list;
  var _count = _fnList.length - 1;
  return function (...params) {
    var _result = _fnList[_count](...params);
    while (_count) {
      _result = _fnList[--_count](_result);
    }
    return _result;
  };
}
