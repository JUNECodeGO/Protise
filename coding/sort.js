/** @format */

function swap(arr, i, j) {
  let temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}
/**
 * 冒泡排序 两两交换 （插入，选择， 冒泡的事件复杂度都是 n的平方）
 *
 * @format
 */
function sort_1(arr) {
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      if (arr[i] > arr[j]) {
        swap(arr, i, j);
      }
    }
  }
}
/**
 * 快速排序 找到一个P点，把小的放左边 大的放右边 （时间复杂度都是 nlogn 最坏情况 n 的平方）
 *
 * @format
 */
function sort_2(arr) {
  const len = arr.length;
  function findP(l, r) {
    let target = arr[l];
    let k = l + 1;
    let j = r;
    while (k < j) {
      while (k < r && arr[k] <= target) k++;
      while (j > l && arr[j] > target) j--;
      if (k > j) break;
      swap(arr, k, j);
    }
    swap(arr, l, j);
    return j;
  }
  function sort(l, r) {
    if (l >= r) return;
    const p = findP(l, r);
    sort(l, p - 1);
    sort(p + 1, r);
  }
  sort(0, len - 1);
}

/**
 * 归并排序 将数组平均分 最后再合在一起（时间复杂度都是 nlogn ）
 *
 * */

function sort_3(arr) {
  const len = arr.length;
  const temp = new Array(len);
  function merge(l, mid, r) {
    for (let i = l; i <= r; i++) {
      temp[i] = arr[i];
    }

    let p = l;
    let j = mid + 1;
    for (let i = l; i <= r; i++) {
      if (p > mid) {
        arr[i] = temp[j++];
      } else if (j > r) {
        arr[i] = temp[p++];
      } else if (temp[p] <= temp[j]) {
        arr[i] = temp[p++];
      } else {
        arr[i] = temp[j++];
      }
    }
  }
  function sort(l, r) {
    if (l >= r) return;
    let mid = l + Math.floor((r - l) / 2);
    sort(l, mid);
    sort(mid + 1, r);
    merge(l, mid, r);
  }
  sort(0, len - 1);
}
