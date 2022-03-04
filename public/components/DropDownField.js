export default function dropDown(title, key, nodes, attr = null, labelValue = key, extra = "") {

    let firstOption = (attr !== 'multiple') ? `<option selected="true" disabled="disabled"></option>` : '';
    nodes.sort((a, b) => a.title.localeCompare(b.title)))
    let options = (nodes.map((node, index) => {
        return `<option name="field_${key}_${index}" id="field_${key}_${index}" value="${node.id}">${node.title}</option>`
    })).join("");
    return `<div style="display: flex; padding: 0.5em">
        <label class="form-label" value="${labelValue}" for="field_${key}">${title}:</label>
            <select class="form-select field_${key}${extra}" id="field_${key}${extra}" aria-label="key" name="field_${key}${extra}" ${attr}>
            ${firstOption}
            ${options}
            </select>
    </div>`;
};

