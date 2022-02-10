import nodeDefs from "../store/definitions.js";

const FormNode = (d) => {

    const nodeTypesDetail = nodeDefs.nodeTypes.find(obj => {
        return obj.nodeTypeId === parseInt(d.target.id);
    });
    const data = Object.keys(nodeTypesDetail.attributes)
    let dataArray = data.map(obj =>
        `<div >
                <label class="form-label" for="form_${obj}">${obj}:</label>
                <input type="text" class="form-control" id="form_${obj}" name="${obj}" value=""><br>
        </div>`
    );

    const template = `  
        <div class="formNode card position-absolute">
            <div class="card-body">
                ${dataArray.join("")}
                <button type="submit" class="btn btn-primary FormNodeSubmit" value="submit">Submit</button>
            </div>
        </div>
    `;

    return template;
}

export default FormNode;

