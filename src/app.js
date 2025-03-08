import Govneact from "./govneact/govneact.js";

function App() {
  return Govneact.createElement(
    "div",
    null,
    "Hello from splitted Govneact!",
    Govneact.createElement("p", null, "It works")
  );
}

Govneact.render(
  Govneact.createElement(App, null),
  document.getElementById("root")
);
