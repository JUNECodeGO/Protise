/**
 * 拍平
 *
 * @format
 */

function flat(arr) {
  return arr.reduce((a, b) => {
    return a.concat(Array.isArray(b) ? flat(b) : b);
  }, []);
}
