/** @format */

function call(context, ...args) {
  var _context = context || window;

  _context.fn = this;

  var result = _context.fn(...args);

  delete _context.fn;

  return result;
}

function apply(context, args) {
  var _context = context || window;

  _context.fn = this;

  var result = _context.fn(args);

  delete _context.fn;

  return result;
}

function bind(context, args) {
  var _context = context || window;
  var _fn = this;

  return function (args2) {
    return _fn.call(_context, args.concat(args2));
  };
}
