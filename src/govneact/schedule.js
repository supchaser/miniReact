import { commitRoot } from "./fiber.js";
import { performUnitOfWork } from "./fiber.js";

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

// единица обработки
export let nextUnitOfWork = null;

export let currentRoot = null;
export let workingRoot = null;

// массив узлов, которые нужно удалить
export let nodesToRemove = [];

export function setCurrentRoot(newCurrentRoot) {
  currentRoot = newCurrentRoot;
}

export function setWorkingRoot(newWorkingRoot) {
  workingRoot = newWorkingRoot;
}

export function setNextUnitOfWork(newNextUnitOfWork) {
  nextUnitOfWork = newNextUnitOfWork;
}

export function setNodesToRemove() {
  nodesToRemove = [];
}

// функция обратного вызова, запускается, когда основной поток свободен от выполнения других задач\
// (период простоя или режим ожидания браузера)
export function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }

  // добавляем fiber tree в DOM
  if (!nextUnitOfWork && workingRoot) {
    requestAnimationFrame(commitRoot);
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

export function scheduleNextWork(root) {
  workingRoot = root;
  nextUnitOfWork = root;
  nodesToRemove = [];
}
