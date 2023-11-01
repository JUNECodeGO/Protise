/** @format */
// 可用于抢券
function throttle(fn, delay = 500) {
  let startTime = 0;
  return function (arg) {
    const _this = this;
    const curDate = new Date().getTime();
    if (curDate - startTime >= delay) {
      fn.apply(_this, arg);
      startTime = curDate;
    }
  };
}

function debounce(fn, delay = 500) {
  let timer = null;
  return function (args) {
    const _this = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(_this, args);
    }, delay);
  };
}
