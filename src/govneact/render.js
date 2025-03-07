// 1. Создаем новый узел на основе типа (div, span, p, h1 и др.) элемента и не забываем проверку на TEXT_ELEMENT
// 2. Присваиваем узлы пропсы элемента
export function createNode(fiber) {
  const node =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  const isProperty = (key) => key !== "children";
  Object.keys(fiber.props)
    .filter(isProperty)
    .forEach((key) => (node[key] = fiber.props[key]));
}
