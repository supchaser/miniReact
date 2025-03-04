function createElement(type, props, ...children) {
  // у children rest оператор, а у props - spread
  return {
    type,
    props: {
      ...props,
      // map - создает новый массив, применяя заданную функцию к каждому элементу, forEach не создает новый массив и не изменяет исходный
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// для примитивных значений
function createTextElement(nodeValue) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue,
      children: [],
    },
  };
}

// 1. Создаем новый узел на основе типа (div, span, p, h1 и др.) элемента и не забываем проверку на TEXT_ELEMENT
// 2. Присваиваем узлы пропсы элемента
// 3. Сделать тоже самое для каждого потомка узла рекурсивно в новый узел (node)
// 4. Добавляем узел в контейнер
function render(element, container) {
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

export const Govneact = {
  createElement,
  render,
};
