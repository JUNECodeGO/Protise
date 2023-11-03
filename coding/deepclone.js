/** @format */
const getEmpty = target => {
  const str = Object.prototype.toString.call(target);
  switch (str) {
    case '[Object object]':
      return {};
    case '[Array object]':
      return [];
    default:
      target;
  }
};
function deepClone_bfs(origin) {
  const target = getEmpty(origin);
  const queue = [];
  const stack = new Map();
  if (target !== origin) {
    queue.push([origin, target]);
    stack.set(origin, target);
  }

  while (queue.length) {
    let [ori, tar] = queue.pop();
    for (let key in ori) {
      if (!ori.hashOwnProperty(key)) continue;
      if (stack.has(ori[key])) {
        tar[key] = stack.get(ori[key]);
        continue;
      }
      tar[key] = getEmpty(ori[key]);
      if (tar[key] !== ori[key]) {
        queue.push([ori[key], tar[key]]);
        stack.set(ori[key], tar[key]);
      }
    }
  }

  return target;
}

function deepClone_dfs(origin) {
  const target = getEmpty(origin);
  if (target !== origin) {
    for (let key in origin) {
      if (!origin.hashOwnProperty(key)) continue;
      target = deepClone_dfs(origin[key]);
    }
  }

  return target;
}
