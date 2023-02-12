// functions for ease of DOM manip

const $ = selector => document.querySelector(selector);

const create = (elementType, parentNode, selectorType, selectorName, textContent) => {
    // make the element
    let element = document.createElement(elementType);
    // give it a class OR id
    switch (selectorType) {
        case 'id': element.id = selectorName; break;
        case 'class': element.className = selectorName; break;
    }
    // put text inside the element
    element.textContent = textContent;
    // append element to a parent
    parentNode.appendChild(element);

    return element;
}

// loads up the basic body

export const Startup = (db => {
    console.warn('Invoking Startup');
    // body
    const sidebar = create('aside', db, undefined, undefined, undefined);
    const content = create('main', db, undefined, undefined, undefined);
    // places where content will be generated
    const projectView = create('div', sidebar, 'id', 'projects', undefined);
    const todoView = create('div', content, 'id', 'todos', undefined);
})(document.body);