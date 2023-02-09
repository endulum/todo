export const $ = selector => document.querySelector(selector);

export const create = (elementType, className, textContent, parentNode) => {
    let element = document.createElement(elementType);
    element.classList.add(className);
    element.textContent = textContent;
    parentNode.appendChild(element);
    return element;
}