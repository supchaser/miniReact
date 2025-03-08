import {
  setWorkingRoot,
  currentRoot,
  setNextUnitOfWork,
  setNodesToRemove,
} from "./schedule.js";
import { incrementHookIndex, workingFiber, hookIndex } from "./fiber.js";

export function useState(initialState) {
  const oldHook =
    workingFiber.alternate &&
    workingFiber.alternate.hooks &&
    workingFiber.alternate.hooks[hookIndex];

  const hook = {
    state: oldHook
      ? oldHook.state
      : initialState instanceof Function
      ? initialState()
      : initialState,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action instanceof Function ? action(hook.state) : action;
  });

  const setState = (action) => {
    hook.queue.push(action);

    const workingRoot = {
      node: currentRoot.node,
      props: currentRoot.props,
      alternate: currentRoot,
    };

    setWorkingRoot(workingRoot);

    setNextUnitOfWork(workingRoot);
    setNodesToRemove();
  };

  workingFiber.hooks.push(hook);
  incrementHookIndex();

  return [hook.state, setState];
}
