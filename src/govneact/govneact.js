export const Govneact = {
  createElement(type, props, children) {
    const element = {
      type,
      props: props || {},
    };

    if (children) {
      element.props.children = children;
    }

    return element;
  },

  // element - то, что мы хотим отрендерить
  // container - где мы хотим отрендерить
  render(element, container) {
    const componentInstance = new GovneactDOMComponent(element);
    return componentInstance.mountComponent(container);
  },
};

class GovneactDOMComponent {
  constructor(element) {
    this._currentElement = element;
  }

  mountComponent(container) {
    const domElement = document.createElement(this._currentElement.type);
    const text = this._currentElement.props.children;
    const textNode = document.createTextNode(text);
    domElement.appendChild(textNode);

    container.appendChild(domElement);

    this._hostNode = domElement;
    return domElement;
  }
}
