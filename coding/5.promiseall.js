/** @format */

function PromiseAll(arr) {
  var _list = Array.from(arr);
  let count = _list.length;
  let _result = [];
  return new Promise((resolve, reject) => {
    for (let i = 0; i < count; i++) {
      Promise.resolve(_list[i])
        .then(val => {
          _result[i] = val;
          count--;
          if (!count) {
            resolve(_result);
          }
        })
        .catch(e => {
          reject(e);
        });
    }
  });
}
