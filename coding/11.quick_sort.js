/** @format */

/**
 * @param {number[]} nums
 * @return {number[]}
 */
function swap(nums, l, r) {
  var temp = nums[l];
  nums[l] = nums[r];
  nums[r] = temp;
}
function random(nums) {
  const len = nums.length - 1;
  for (let i = 0; i < nums.length; i++) {
    let randomI = i + Math.floor(Math.random() * (len - i));
    swap(i, randomI);
  }
}
var sortArray = function (nums) {
  function findP(l, r) {
    let target = nums[l];

    let i = l + 1;
    let j = r;

    while (i <= j) {
      while (i < r && nums[i] <= target) i++;
      while (j > l && nums[j] > target) j--;
      if (i >= j) {
        break;
      }
      swap(nums, i, j);
    }
    swap(nums, l, j);
    return j;
  }

  function _sort(l, r) {
    if (l >= r) return;

    const p = findP(l, r);
    _sort(l, p - 1);
    _sort(p + 1, r);
  }
  random(nums);
  _sort(0, nums.length - 1);

  return nums;
};

var WordDictionary = function () {
  this._queue = [];
};

/**
 * @param {string} word
 * @return {void}
 */
WordDictionary.prototype.addWord = function (word) {
  this._queue.push(word);
};

/**
 * @param {string} word
 * @return {boolean}
 */
WordDictionary.prototype.search = function (word) {
  if (word.indexOf('.') > -1) {
    var reg = new RegExp(word);
    return this._queue.some(item => reg.test(item));
  } else {
    return this._queue.includes(word);
  }
};

/**
 * Your WordDictionary object will be instantiated and called as such:
 * var obj = new WordDictionary()
 * obj.addWord(word)
 * var param_2 = obj.search(word)
 */
