export function createElement(type, props, ...children) {
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
