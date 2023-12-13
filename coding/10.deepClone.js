/** @format */

function getEmpty(target) {
  var str = Object.prototype.toString.call(target);
  switch (str) {
    case '[Array, object]':
      return [];
    case '[Object, object]':
      return {};
    default:
      return target;
  }
}
function deepClone(origin) {
  var target = getEmpty(origin);
  if (target !== origin) {
    var map = new Map();
    var queue = [[origin, target]];
    map.set(origin, target);
    while (queue.length) {
      var [curOrigin, curTarget] = queue.unshift();
      for (let key in curOrigin) {
        if (curOrigin.hasOwnProperty(key)) {
          if (map.has(curOrigin[key])) {
            curTarget[key] = map.get(curOrigin[key]);
            continue;
          }
          curTarget[key] = getEmpty(curOrigin[key]);
          if (curTarget[key] !== curOrigin[key]) {
            map.set(curOrigin[key], curTarget[key]);
            queue.push([curOrigin[key], curTarget[key]]);
          }
        }
      }
    }
  }
  return target;
}
