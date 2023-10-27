/** @format */

function sleep(count = 300) {
  return new Promise(resolve => setTimeout(resolve, count));
}

function delay(Fn, count = 300, ...args) {
  return new Promise(resolve =>
    setTimeout(() => {
      Promise.resolve(Fn(...args)).then(resolve);
    }, count)
  );
}
