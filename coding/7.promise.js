/** @format */

var PENDING = 'PENDING';
var REJECTED = 'REJECTED';
var FULFILLED = 'FULFILLED';

class MyPromise {
  constructor(fn) {
    _status = PENDING;
    _value = undefined;
    _fulfilledQueue = [];
    _rejectedQueue = [];

    _resolveFn = function (val) {
      setTimeout(() => {
        if (this._status === PENDING) {
          this._value = val;
          this._status = FULFILLED;
          _fulfilledQueue.forEach(fn => fn(this._value));
        }
      }, 0);
    };

    _rejectFn = function (val) {
      setTimeout(() => {
        if (this._status === PENDING) {
          this._value = val;
          this._status = REJECTED;
          _rejectedQueue.forEach(fn => fn(this._value));
        }
      }, 0);
    };
    fn(_resolveFn, _rejectFn);
  }

  then(fulfilledFn, rejectedFn) {
    return new MyPromise((resolve, reject) => {
      const successFn = val => {
        var result = fulfilledFn && fulfilledFn(val);
        result instanceof MyPromise
          ? result.then(resolve, reject)
          : resolve(result);
      };
      const rejectFn = val => {
        var result = rejectedFn && rejectedFn(val);
        result instanceof MyPromise
          ? result.then(resolve, reject)
          : reject(result);
      };
      if (this._status === PENDING) {
        this._fulfilledQueue.push(successFn);
        this._rejectedQueue.push(rejectFn);
      } else if (this._status === FULFILLED) {
        successFn(this._value);
      } else {
        rejectFn(this._value);
      }
    });
  }
  catch(rejectedFn) {
    return this.then(undefined, rejectedFn);
  }
}
