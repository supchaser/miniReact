// 1. Создаем новый узел на основе типа (div, span, p, h1 и др.) элемента и не забываем проверку на TEXT_ELEMENT
// 2. Присваиваем узлы пропсы элемента
// 3. Сделать тоже самое для каждого потомка узла рекурсивно в новый узел (node)
// 4. Добавляем узел в контейнер
export function render(element, container) {
  const node =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);

  const isProperty = (key) => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((key) => (node[key] = element.props[key]));

  element.props.children.forEach((child) => render(child, node));

  container.appendChild(node);
}
