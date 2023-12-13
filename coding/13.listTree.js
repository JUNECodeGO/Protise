/**
 * let arr = [
 *     {id: 1, name: '部门1', pid: 0},
 *     {id: 2, name: '部门2', pid: 1},
 *     {id: 3, name: '部门3', pid: 1},
 *     {id: 4, name: '部门4', pid: 3},
 *     {id: 5, name: '部门5', pid: 4},
 *   ]
 *
 *   =>
 *
 *   [
 *     {
 *         "id": 1,
 *         "name": "部门1",
 *         "pid": 0,
 *         "children": [
 *             {
 *                 "id": 2,
 *                 "name": "部门2",
 *                 "pid": 1,
 *                 "children": []
 *             },
 *             {
 *                 "id": 3,
 *                 "name": "部门3",
 *                 "pid": 1,
 *                 "children": [
 *                     // 结果 ,,,
 *                 ]
 *             }
 *         ]
 *     }
 *   ]
 *
 * @format
 */

function transfer() {
  const map = arr.reduce((cur, pre) => {
    const {id} = pre;
    // 浅拷贝 不改变原数据
    cur[id] = Object.assign({}, pre);
  }, {});
  const result = [];
  for (let item of arr) {
    const {pid} = item;
    if (!pid) {
      result.push(map[pid]);
    }
  }
}
