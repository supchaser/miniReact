import Govneact from "./govneact/govneact.js";

function Counter() {
  const [count, setCount] = Govneact.useState(0);

  return Govneact.createElement(
    "div",
    null,
    Govneact.createElement("h2", null, `Count: ${count}`),
    Govneact.createElement(
      "button",
      {
        onClick: () => setCount((prev) => prev + 1),
      },
      "Increment"
    )
  );
}

function App() {
  return Govneact.createElement(
    "div",
    null,
    "Test of useState",
    Govneact.createElement(Counter, null)
  );
}

Govneact.render(
  Govneact.createElement(App, null),
  document.getElementById("root")
);
