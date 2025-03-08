import { createNode, updateNode } from "./nodeUtils.js";
import {
  setCurrentRoot,
  setWorkingRoot,
  workingRoot,
  nodesToRemove,
} from "./schedule.js";

export let workingFiber = null;
export let hookIndex = 0;

export function incrementHookIndex() {
  hookIndex++;
}

// 1. Создать новый узел и добавить его в DOM
// 2. Для каждого потомка создаем волокно
// 3. Добавить в Fiber Tree новое волкно либо как child, либо как sibling
// 4. Выбрать следующую единицу работы
export function performUnitOfWork(fiber) {
  const isFunctionalComponent = fiber.type instanceof Function;
  if (isFunctionalComponent) {
    updateFunctionalComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  if (!isFunctionalComponent && !fiber.node) {
    fiber.node = createNode(fiber);
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

function updateFunctionalComponent(fiber) {
  workingFiber = fiber;
  hookIndex = 0;
  workingFiber.hooks = [];
  const childElement = fiber.type(fiber.props);
  const children = [childElement];
  createNewFiber(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.node) {
    fiber.node = createNode(fiber);
  }

  createNewFiber(fiber, fiber.props.children);
}

export function commitRoot() {
  nodesToRemove.forEach(commitWork);
  commitWork(workingRoot.child);
  setCurrentRoot(workingRoot);
  setWorkingRoot(null);
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let parentFiber = fiber.parent;
  while (!parentFiber.node) {
    parentFiber = parentFiber.parent;
  }

  const parentNode = parentFiber.node;

  switch (fiber.action) {
    case "ADD":
      fiber.node && parentNode.append(fiber.node);
      break;
    case "UPDATE":
      fiber.node && updateNode(fiber.node, fiber.alternate.props, fiber.props);
      break;
    case "DELETE":
      return commitRemove(fiber);
    default:
      return;
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitRemove(fiber) {
  console.warn("commitRemove:", fiber.type, fiber);

  if (fiber.node) {
    return fiber.node.remove();
  }

  commitRemove(fiber.child);
}

export function createNewFiber(workingFiber, elements) {
  let index = 0;
  let oldFiber = workingFiber.alternate && workingFiber.alternate.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    const sameType = oldFiber && element && oldFiber.type == element.type;

    // если старое волкно и новый элемент имеют одинаковый тип, сохраняем узел и обновляем его пропы
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        node: oldFiber.node,
        parent: workingFiber,
        alternate: oldFiber,
        action: "UPDATE",
      };
    }

    // если типы разные и имеется новый элемент, создаем новый узел
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        node: null,
        parent: workingFiber,
        alternate: null,
        action: "ADD",
      };
    }

    // если типы разные и имеется старое волокно, удаляем узел
    if (oldFiber && !sameType) {
      oldFiber.action = "DELETE";
      nodesToRemove.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      workingFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
