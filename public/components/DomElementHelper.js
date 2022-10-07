export function createHtmlElementWithData(elementName, attributeData = {}) {
    let newElement = document.createElement(elementName);
    for (let [key, value] of Object.entries(attributeData)) {
        newElement.setAttribute(key, value)
    }
    return newElement
    }

export function appendChildsToSelector(selector, nodes) {
    if (nodes.constructor === Array) {
        for (const node of nodes) {
        document.querySelector(selector).appendChild(node);
        }
    } else {
        document.querySelector(selector).appendChild(nodes)
    }
}