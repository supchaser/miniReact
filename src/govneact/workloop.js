import { createNode } from "./render";

// единица обработки
let nextUnitOfWork = null;
let workingRoot = null;

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

// 1. Создать новый узел и добавить его в DOM
// 2. Для каждого потомка создаем волокно
// 3. Добавить в Fiber Tree новое волкно либо как child, либо как sibling
// 4. Выбрать следующую единицу работы
function performUnitOfWork(fiber) {
  if (!fiber.node) {
    fiber.node = createNode(fiber);
  }

  let index = 0;
  let prevSibling = null;
  const elements = fiber.props.children;

  while (index < elements.length) {
    const element = elements[index];

    const newFiber = {
      type: element.type,
      props: element.props,
      parent: fiber,
      node: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevSibling.sibling = newFiber;
    }

    index++;
    prevSibling = newFiber;
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent;
  }

  return null;
}

export function render(element, container) {
  workingRoot = {
    node: container,
    props: {
      children: [element],
    },
  };

  nextUnitOfWork = workingRoot;
}
