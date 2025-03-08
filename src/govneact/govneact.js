import { createElement } from "./createElement.js";
import { currentRoot, scheduleNextWork } from "./schedule.js";
import { useState } from "./fiber.js";

function render(element, container) {
  const workingRoot = {
    node: container,
    props: {
      children: [element],
    },

    alternate: currentRoot,
  };

  scheduleNextWork(workingRoot);
}

const Govneact = {
  createElement,
  render,
  useState,
};

export default Govneact;
