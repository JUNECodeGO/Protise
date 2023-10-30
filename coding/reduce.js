/** @format */

Array.prototype.reduce = function (fn, pre) {
  if (!(typeof fn === 'function')) throw Error();
  const len = this.length;
  if (!len) return pre;
  if (pre) {
    let result = pre;
    for (let i = 0; i < len; i++) {
      result = fn(result, this[i], i, this);
    }
    return result;
  } else {
    let final;
    for (let i = 0; i < len; i++) {
      final = fn(!i ? this[i++] : final, !i ? this[i++] : this[i], i, this);
    }
    return final;
  }
};
