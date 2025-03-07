// единица обработки
let nextUnitOfWork = null;

// подстраховка на случай отсутсвия RequestIdleCallback
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (handler) {
    const start = Date.now();

    return setTimeout(() => {
      handler({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1);
  };

// функция обратного вызова, запускается, когда основной поток свободен от выполнения других задач\
// (период простоя или режим ожидания браузера)
export function workloop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  requestIdleCallback(workloop);
}

function performUnintOfWork(nextUnitOfWork) {
  // TODO
}
