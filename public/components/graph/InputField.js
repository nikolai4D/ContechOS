export default function inputField(title, key, value = "", attr = null) {
    return `<div style="display: flex; padding: 0.5em">
        <label class="form-label" id="field_${key}" for="field_${key}">${title}:</label>
        <input type="text" class="form-control" name="field_${key}" value="${value}" ${attr}><br>
    </div>`;
};