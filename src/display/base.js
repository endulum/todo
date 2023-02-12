export const $ = selector => document.querySelector(selector);

// helps create elements quickly
export const create = (elementType, parentNode, selectorType, selectorName, textContent) => {
    let element = document.createElement(elementType);
    element.textContent = textContent;
    if (parentNode != null) parentNode.appendChild(element);
    switch (selectorType) {
        case 'id': element.id = selectorName; break;
        case 'class': element.className = selectorName; break;
    }
    return element;
}

// loads up body
export const Base = (db => {
    console.warn('Invoking Foundation');
    const sidebar = create('aside', db, null, null, null);
    const content = create('main', db, null, null, null);
    const projectView = create('div', sidebar, 'id', 'projects', null);
    const todoView = create('div', content, 'id', 'todos', null);
    return { projectView, todoView };
})(document.body);