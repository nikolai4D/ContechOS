export default function dropDown(title, key, nodes, attr = null, labelValue = key, extra = "") {

    let firstOption = (attr !== 'multiple') ? `<option selected="true" disabled="disabled"></option>` : '';
    nodes.sort((a, b) => a.title.localeCompare(b.title))
    let options = (nodes.map((node, index) => {
        return `<option name="field_${key}_${index}" id="field_${key}_${index}" value="${node.id}">${node.title}</option>`
    })).join("");
    return `<div>
             <div>
            <label class="form-text" value="${labelValue}" for="field_${key}">${title}</label>
                <select class="form-select p-1 bg-light rounded field_${key}${extra}" id="field_${key}${extra}" aria-label="key" name="field_${key}${extra}" ${attr}>
                ${firstOption}
                ${options}
                </select>
            </div>
        </div>`;
};

