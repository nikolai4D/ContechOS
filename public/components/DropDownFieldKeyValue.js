export default function dropDownKeyValue(title, key, value, attr = null) {
    return `<div class="form_add_props" style="display: flex; padding: 0.5em">
    <button class="form_add_more_props_button">Add more props</button>
        <label class="form-label">${title}:</label>
            <select class="form-select" aria-label="key" id="field_${key}" name="${key}" ${attr}>
                <option selected>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
            :
            <select class="form-select" aria-label="key" id="field_${value}" name="${value}" ${attr}>
            <option selected>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
        </select>
    </div>`;
};