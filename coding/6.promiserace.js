/** @format */

function PromiseAll(arr) {
  var _list = Array.from(arr);
  return new Promise((resolve, reject) => {
    for (let i = 0; i < count; i++) {
      Promise.resolve(_list[i])
        .then(val => {
          resolve(val);
        })
        .catch(e => {
          reject(e);
        });
    }
  });
}
