// является ли ключ событием?
const isEvent = (key) => key.startsWith("on");

// является ли ключ свойством DOM элемента
const isProperty = (key) => key !== "children" && !isEvent(key);

// добавилось ли свойство?
const wasAdded = (prev, next) => (key) => prev[key] !== next[key];

// удалено ли свойство?
const wasDeleted = (prev, next) => (key) => !(key in next);

// 1. Создаем новый узел на основе типа (div, span, p, h1 и др.) элемента и не забываем проверку на TEXT_ELEMENT
// 2. Присваиваем узлы пропсы элемента
export function createNode(fiber) {
  const node =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode(fiber.props.nodeValue)
      : document.createElement(fiber.type);

  updateNode(node, {}, fiber.props);

  return node;
}

export function updateNode(node, prevProps, nextProps) {
  // удаление старых событий
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || wasAdded(nextProps, prevProps)(key))
    .forEach((key) => {
      const eventType = key.toLowerCase().substring(2);
      node.removeEventListener(eventType, prevProps[key]);
    });

  // удаление старых свойств
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(wasDeleted(prevProps, nextProps))
    .forEach((key) => (node[key] = ""));

  // добавление новых или измененных свойств
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(wasAdded(prevProps, nextProps))
    .forEach((key) => {
      if (key === "style" && typeof nextProps[key] === "object") {
        Object.assign(node.style, nextProps[key]);
      } else {
        node[key] = nextProps[key];
      }
    });

  // добавление новых событий
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(wasAdded(prevProps, nextProps))
    .forEach((key) => {
      const eventType = key.toLowerCase().substring(2);
      node.addEventListener(eventType, nextProps[key]);
    });
}
