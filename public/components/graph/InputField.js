export default function inputField(title, key, value = "", attr = null) {
    return `<div>
    <div>
        <label class="form-text" id="field_${key}" for="field_${key}">${title}</label>
        <input type="text" class="form-control-plaintext p-1 bg-light rounded" id="field_${key}_input" name="field_${key}" value="${value}" ${attr}>
    </div>
    </div>
    `;
};
