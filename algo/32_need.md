<!-- @format -->

### 题目

给你一个只包含 '(' 和 ')' 的字符串，找出最长有效（格式正确且连续）括号子串的长度。

示例 1：

输入：s = "(()"
输出：2
解释：最长有效括号子串是 "()"
示例 2：

输入：s = ")()())"
输出：4
解释：最长有效括号子串是 "()()"
示例 3：

输入：s = ""
输出：0

提示：

0 <= s.length <= 3 \* 104
s[i] 为 '(' 或 ')'

```js
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function (s) {
  const len = s.length;
  const dp = new Array(len + 1).fill(0);

  const queue = [];

  for (let i = 0; i < len; i++) {
    if (s[i] === '(') {
      queue.push(i);
      dp[i + 1] = 0;
    } else {
      if (queue.length) {
        const leftIndex = queue.pop();
        dp[i + 1] = 1 + i - leftIndex + dp[leftIndex];
      } else {
        dp[i + 1] = 0;
      }
    }
  }
  let max = -Infinity;
  for (let i = 0; i <= len; i++) {
    max = Math.max(max, dp[i]);
  }
  return max;
};
```
