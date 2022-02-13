export default function inputField(key) {
    return `<div style="display: flex; padding: 0.5em">
        <label class="form-label" for="field_${key}">${key}:</label>
        <input type="text" class="form-control" name="field_${key}" value=""><br>
    </div>`;
};
