<!-- @format -->

###

给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。

请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

你必须设计并实现时间复杂度为 O(n) 的算法解决此问题。

示例 1:

输入: [3,2,1,5,6,4], k = 2
输出: 5
示例 2:

输入: [3,2,3,1,2,4,5,5,6], k = 4
输出: 4

提示：

1 <= k <= nums.length <= 105
-104 <= nums[i] <= 104

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  const len = nums.length;
  k = len - k;
  const findP = (l, r) => {
    let target = nums[l];
    let p = l + 1;
    let k = r;
    while (p <= k) {
      while (nums[p] <= target && p < r) {
        p++;
      }
      while (nums[k] > target && k > l) {
        k--;
      }
      if (p >= k) break;
      let temp = nums[p];
      nums[p] = nums[k];
      nums[k] = temp;
    }

    nums[l] = nums[k];
    nums[k] = target;
    return k;
  };

  let left = 0;
  let right = len - 1;
  while (left <= right) {
    const p = findP(left, right);
    if (p === k) return nums[p];
    if (p < k) {
      left = p + 1;
    } else {
      right = p - 1;
    }
  }
  return -1;
};
```
