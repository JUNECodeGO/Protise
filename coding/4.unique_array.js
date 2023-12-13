/**
 * 数组去重
 *
 * @format
 */

function unique_1(array) {
  return [...new Set(array)];
}

function unique_2(array) {
  const hash = {};
  for (let num of array) {
    if (hash[num]) continue;
    hash[num] = true;
  }
  return Object.keys(hash);
}

function unique_3(array) {
  return array.filter((item, index) => array.indexof(item) === index);
}

function unique_4(array) {
  return array.reduce((pre, cur) => {
    if (!pre.includes(cur)) {
      pre.push(cur);
    }
    return pre;
  }, []);
}
