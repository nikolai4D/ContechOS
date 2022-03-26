import Actions from "../../store/Actions.js";
import { State } from '../../store/State.js';


export function FormRead() {
    console.log(State.clickedObj)
    let { defId, defTypeTitle } = State.clickedObj
    let definitions = JSON.parse(sessionStorage.getItem('definitions'))[0]
    let def = definitions.defs.find((obj) => obj.defId === defId);


    let defType = def.defTypes.find((obj) => obj.defTypeTitle === defTypeTitle);
    defType.defId = defId;

    let listWithAttributes = defType.attributes.map(attribute => {
        let anInput = '';
        let aLabel = '';
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
            aLabel = 'parent'
            anInput = `<input type="text" readonly class="form-control-plaintext  p-1 bg-light rounded" value="${parent.title}">
     `
        }
        else if (Object.keys(attribute)[0] === 'props') {
            aLabel = `${Object.keys(attribute)[0]}`
            let props = JSON.parse(sessionStorage.getItem('props'))[0].nodes;
            let propKey = '';
            let propVal = '';
            anInput = `<div class="border border-1 rounded-2 p-2">` + State.clickedObj[Object.keys(attribute)[0]].map(element => {
                propKey = props.find(prop => prop.id === Object.keys(element)[0])
                propVal = props.find(prop => prop.id === Object.values(element)[0])
                return `<label class="form-text">${propKey.title}</label>
                <input type="text" readonly class="form-control-plaintext  p-1 bg-light rounded"  value="${propVal.title}">`
            }).join("") + "</div>";
        }

        else if (Array.isArray(State.clickedObj[Object.keys(attribute)[0]])) {
            aLabel = [Object.keys(attribute)[0]]
            let propVal = '';

            let props = JSON.parse(sessionStorage.getItem('props'))[0].nodes;

            anInput = State.clickedObj[Object.keys(attribute)[0]].map(element => {
                propVal = props.find(prop => prop.id === element);
                return `
                    <input type="text" readonly class="form-control-plaintext  p-1 bg-light rounded" value="${propVal.title}">
                `
            }).join("")
        }

        else {
            aLabel = [Object.keys(attribute)[0]]
            anInput = `
            <input type="text" readonly class="form-control-plaintext  p-1 bg-light rounded" value="${State.clickedObj[Object.keys(attribute)[0]]}">
        `
        }
        return `
            <div>
                <label class="form-text">${aLabel}</label>
            <div>
            ${anInput}
            </div> </div>`})


    const template = `
    <div class="formRead position-absolute">
        <div><h5></h5></div>
        <div class="card" tabindex="-1">
        <div style="display:flex;justify-content: right;/*! align-items: right; */padding-top: 0.5em;padding-right: 0.5em;">    <i id="penFormEdit" class="bi bi-pencil-fill text-black opacity-25" style="padding-right:0.3em;"></i>    <button type="button" class="btn-close close-button" aria-label="Close"></button>
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