export const $ = selector => document.querySelector(selector);

// helps create elements quickly
export const create = (elementType, parentNode, textContent) => {
    let element = document.createElement(elementType);
    element.textContent = textContent;
    if (parentNode != null) parentNode.appendChild(element);
    return element;
}

// loads up body
export const Base = (db => {
    const sidebar = create('aside', db, null);
    const content = create('main', db, null);

    const projectView = create('div', sidebar, null);
    projectView.id = 'projects';
    const todoView = create('div', content, null);
    todoView.id = 'todos'

    return { projectView, todoView };
})(document.body);