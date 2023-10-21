###
给你一个 只包含正整数 的 非空 数组 nums 。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

 

示例 1：

输入：nums = [1,5,11,5]
输出：true
解释：数组可以分割成 [1, 5, 5] 和 [11] 。
示例 2：

输入：nums = [1,2,3,5]
输出：false
解释：数组不能分割成两个元素和相等的子集。
 

提示：

1 <= nums.length <= 200
1 <= nums[i] <= 100
通过次数
465.1K
提交次数

```js
/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function(nums) {
    const len  = nums.length
    const total = nums.reduce((a,b) => a+b, 0)
    if(total % 2) return false
    const sum = total / 2
    if(nums[len-1] > sum) return false

    const dp =  new Array(len+1).fill().map(() => new Array(sum+1).fill(false))

    for(let i = 0; i <= len; i++){
       dp[i][0] = true
    }

for(let i = 1; i <= len; i++){
     for(let j = 1; j <= sum; j++){
         if(j - nums[i] >= 0){
             dp[i][j] = dp[i-1][j-nums[i]] || dp[i-1][j]
         }else{
             dp[i][j] = dp[i-1][j]
         }
     }
    }


    return dp[len][sum]
};
```