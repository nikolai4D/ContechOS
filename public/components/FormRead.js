import Actions from "../store/Actions.js";
import { State } from '../store/State.js';


export function FormRead() {
    let { defId, defTypeTitle } = State.clickedObj
    let definitions = JSON.parse(sessionStorage.getItem('definitions'))[0]
    let def = definitions.defs.find((obj) => obj.defId === defId);


    let defType = def.defTypes.find((obj) => obj.defTypeTitle === defTypeTitle);
    defType.defId = defId;

    let listWithAttributes = defType.attributes.map(attribute => {
        let anInput = '';
        if (State.clickedObj[Object.keys(attribute)[0]].length === 0) {
            return `    <div class="form-text">+ ${[Object.keys(attribute)[0]]}</div>
            `
        }
        else if (Object.keys(attribute)[0] === 'parentId') {
            let parentId = State.clickedObj[Object.keys(attribute)[0]];

            let parent;
            if (parentId.substring(0, 1) === 'c') {
                let configs = JSON.parse(sessionStorage.getItem('configs'))[0].nodes;
                parent = configs.find(config => config.id === parentId)
            }
            else {
                let datas = JSON.parse(sessionStorage.getItem('datas'))[0].nodes;
                parent = datas.find(data => data.id === parentId)

            }
            anInput = `<span class="d-inline-block" tabindex="0" data-bs-toggle="tooltip" title="${parent.title}">
            <input type="text" readonly class="form-control-plaintext  p-1 bg-light rounded" id="staticEmail" value="${State.clickedObj[Object.keys(attribute)[0]]}">
        </span>`
        }
        else {
            anInput = `
            <input type="text" readonly class="form-control-plaintext  p-1 bg-light rounded" id="staticEmail" value="${State.clickedObj[Object.keys(attribute)[0]]}">
        `
        }
        return `
            <div>
                <label for="staticEmail"  class="form-text">${[Object.keys(attribute)[0]]}</label>
            <div>
            ${anInput}
            </div>
        </div>`})


    const template = `
    <div class="formRead position-absolute">
        <div><h5></h5></div>
        <div class="card" tabindex="-1">
        <div style="display:flex;justify-content: right;/*! align-items: right; */padding-top: 0.5em;padding-right: 0.5em;">        <button type="button" class="btn-close close-button" aria-label="Close"></button>
        </div>
        <div class="card-body" style="padding-top: 0em;">
           <form id="formRead" >
           ${listWithAttributes.join("")}

            </form>
        </div>
        </div>
    </div>
`;
    return template;
}