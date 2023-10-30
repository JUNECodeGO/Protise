/** @format */

const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

const isFunction = target => typeof target === 'function';

class Pom {
  constructor(handler) {
    this.value = undefined;
    this.status = PENDING;
    this.fulfilledQueue = [];
    this.rejectedQueue = [];

    const resolve = value => {
      setTimeout(() => {
        this.value = value;
        this.status = FULFILLED;
        this.fulfilledQueue.forEach(fn => fn(this.value));
      });
    };
    const reject = value => {
      setTimeout(() => {
        this.value = value;
        this.status = REJECTED;
        this.fulfilledQueue.forEach(fn => fn(this.value));
      });
    };

    try {
      handler(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onReject) {
    onFulfilled = !!onFulfilled ? onFulfilled : value => value;
    onReject = !!onReject ? onReject : error => error;
    const {status, fulfilledQueue, rejectedQueue} = this;
    return new Pom((resolve, reject) => {
      if (status === PENDING) {
        fulfilledQueue.push(val => {
          setTimeout(() => {
            try {
              const res = onFulfilled(val);
              res instanceof Pom ? res.then(resolve, reject) : resolve(res);
            } catch (error) {
              reject(error);
            }
          });
        });
        rejectedQueue.push(val => {
          setTimeout(() => {
            try {
              const res = onReject(val);
              res instanceof Pom ? res.then(resolve, reject) : reject(res);
            } catch (error) {
              reject(error);
            }
          });
        });
      } else if (status === FULFILLED) {
        try {
          const res = onFulfilled(val);
          res instanceof Pom ? res.then(resolve, reject) : resolve(res);
        } catch (error) {
          reject(error);
        }
      } else {
        try {
          const res = onReject(val);
          res instanceof Pom ? res.then(resolve, reject) : reject(res);
        } catch (error) {
          reject(error);
        }
      }
    });
  }
  catch(onReject) {
    this.then(null, onReject);
  }
}

function PromiseAll(arrayList) {
  if (!Array.isArray(arrayList)) {
    throw Error();
  }
  return new Promise((resolve, reject) => {
    const len = arrayList.length;
    const resolveList = new Array(len);
    let count = 0;

    for (let i = 0; i < len; i++) {
      Promise.resolve(arrayList[i])
        .then(value => {
          resolveList[i] = value;
          count++;
          if (count === len) {
            resolve(resolveList);
          }
        })
        .catch(error => {
          reject(error);
        });

      try {
      } catch (error) {
        reject(error);
      }
    }
  });
}

function PromiseRace(arrayList) {
  if (!Array.isArray(arrayList)) {
    throw Error();
  }
  return new Promise((resolve, reject) => {
    const len = arrayList.length;

    for (let i = 0; i < len; i++) {
      Promise.resolve(arrayList[i])
        .then(value => {
          resolve(value);
        })
        .catch(error => {
          reject(error);
        });

      try {
      } catch (error) {
        reject(error);
      }
    }
  });
}
