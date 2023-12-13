/**
 * JS实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个。完善下面代码的Scheduler类，使以下程序能够正常输出：
 * class Scheduler {
 *   add(promiseCreator) { ... }
 *   // ...
 * }
 *
 * const timeout = time => {
 *   return new Promise(resolve => {
 *     setTimeout(resolve, time)
 *   }
 * })
 *
 * const scheduler = new Scheduler()
 *
 * const addTask = (time,order) => {
 *   scheduler.add(() => timeout(time).then(()=>console.log(order)))
 * }
 *
 * addTask(1000, '1')
 * addTask(500, '2')
 * addTask(300, '3')
 * addTask(400, '4')
 *
 * // output: 2 3 1 4
 * 整个的完整执行流程：
 *
 * 起始1、2两个任务开始执行
 * 500ms时，2任务执行完毕，输出2，任务3开始执行
 * 800ms时，3任务执行完毕，输出3，任务4开始执行
 * 1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
 * 1200ms时，4任务执行完毕，输出4
 *
 * @format
 */

class Scheduler {
  constructor(size) {
    this._size = size || 3;

    this._queue = [];
    this._processing = 0;
    this._working = false;
  }

  add(task) {
    this._queue.push(Promise.resolve(task));
    this.start();
  }

  _handleWork(fn) {
    fn.then(() => {
      this._processing--;
    });
  }

  _start() {
    if (this._working) {
      return;
    }

    while (this._processing < this._size && this._queue.length) {
      this._handleWork(this._queue.unshift());
      this._processing++;
    }
  }
}
