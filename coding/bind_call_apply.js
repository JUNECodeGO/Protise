/** @format */

Function.prototype.apply = function (context, ...args) {
  if (typeof this !== 'function') {
    throw Error();
  }
  let _context = context || window;

  _context.fn = this;

  let res;

  if (args.length) {
    res = _context.fn();
  } else {
    res = _context.fn(args[0]);
  }
  delete _context.fn;
  return res;
};

Function.prototype.call = function (context, ...args) {
  if (typeof this !== 'function') {
    throw Error();
  }
  let _context = context || window;

  _context.fn = this;

  const res = _context.fn(...args);

  delete _context.fn;
  return res;
};

Function.prototype.bind = function (context, ...args) {
  if (typeof this !== 'function') {
    throw Error();
  }
  let _this = this;
  return function (...args2) {
    _this.apply(context, args.concat(args2));
  };
};
