import { Govneact } from "./govneact/govneact.js";

const element = Govneact.createElement(
  "div",
  { id: "test" },
  "Hello, world!",
  Govneact.createElement("p", null, "This is a test.")
);

Govneact.render(element, document.getElementById("root"));
