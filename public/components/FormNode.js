import nodeDefs from "../store/definitions.js";

const inputForm = async (key) => {
    return await `<div style="display: flex; padding: 0.5em">
        <label class="form-label" for="form_${key}">${key}:</label>
        <input type="text" class="form-control" id="form_${key}" name="${key}" value=""><br>
    </div>`;
};

const dropDown = async (key, attr = null) => {
    return await `<div style="display: flex; padding: 0.5em">
        <label class="form-label" for="form_${key}">${key}:</label>
            <select class="form-select" aria-label="key" id="form_${key}" name="${key}" ${attr}>
                <option selected>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
    </div>`;
};


const dropDownKeyValue = async (title, key, value, attr = null) => {
    return await `<div class="form_add_props" style="display: flex; padding: 0.5em">
    <button class="form_add_more_props_button">Add more props</button>
        <label class="form-label">${title}:</label>
            <select class="form-select" aria-label="key" id="form_${key}" name="${key}" ${attr}>
                <option selected>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
            </select>
            :
            <select class="form-select" aria-label="key" id="form_${value}" name="${value}" ${attr}>
            <option selected>Open this select menu</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
        </select>
    </div>`;
};

const FormNode = async (d, data) => {

    const nodeTypesDetail = await nodeDefs.nodeTypes.find(obj => {
        return obj.nodeTypeId === parseInt(d.target.id);
    });

    console.log(nodeTypesDetail, 'nodeTypesDetails')

    // let title = nodeTypesDetail.title
    let arrayWithEntries = await nodeTypesDetail.attributes

    console.log(arrayWithEntries, 'arrayWithEntries')

    let formString = [];

    await arrayWithEntries.forEach(async obj => {
        let valueOfAttr = Object.values(obj)[0]
        let keyOfAttr = Object.keys(obj)[0]

        if (typeof (valueOfAttr) === 'string') {
            formString.push(await inputForm(keyOfAttr))
        }
        else if (Array.isArray(valueOfAttr)) {
            if (valueOfAttr[0]['nodeTypeId']) {
                formString.push(await dropDown(keyOfAttr, "multiple"))
            }
            else {
                formString.push(await dropDownKeyValue(keyOfAttr, valueOfAttr[0].key.title, valueOfAttr[0].value.title))

                // formString.push(`${keyOfAttr}: dropdown:dropdown (${valueOfAttr[0].key.title}, ${valueOfAttr[0].value.title}),`)
                // formString.push(`${await dropDown(keyOfAttr)} : ${await dropDown(keyOfAttr)}`)
            }
        }
        else if (typeof (valueOfAttr) === 'object') {
            // formString += `${keyOfAttr}: dropdown (${valueOfAttr.title}),`
            formString.push(await dropDown(keyOfAttr))
        }
    });
    console.log(await formString.join(""))

    const template = await `  
    <div class="formNode card position-absolute">
        <div class="card-body">
            ${await formString.join("")}
            <button type="submit" class="btn btn-primary FormNodeSubmit" value="submit">Submit</button>
        </div>
    </div>
`;
    return await template;



    // TODO:
    /*
     
    function getNodesByNodeTypeReturnDropdown(node):
            In nodeDefs, get object where nodeType === node.nodeTypeId 
            ley allNodeWithSameNodeType = Get all of nodeTypes with that nodenodeTypeId from the db (by title)
            keyToGetValueFrom = nodeDefsObj['attributes']
            iternate allNodeWithSameNodeType in a dropdown, show node[keyToGetValueFrom] as value
            return drowpdown                
     
     
     
    - For each attribute
         if value is string(number or boolean:?)
            return empty input
     
        - Else if value is an Object:
                if Object['nodeTypeId']:
                    getNodesByNodeTypeReturnDropdown(value)
     
        - Else if Array:
            if an Object:
                if Object['nodeTypeId']:
                    getNodesByNodeTypeReturnDropdown(value)
                    return add mulitple in dropdown
                
                else:
                    key:
                        getNodesByNodeTypeReturnDropdown(value)
                    value:
                        getNodesByNodeTypeReturnDropdown(value)
    
                    when pick key from dropdown --> filter valueList where propKeyId == keyId
    
            (if contains string, number or boolean:
                return dropdown with )
        
    str, boolean -> input
    object with node['nodetype'] -> dropdown 
    arrays with objects with node['nodetype'] -> multiple choice dropdown 
    arrays with objects with objects of keys and values -> dropdown : dropdown per element
     
     
    */


    // const data = Object.keys(nodeTypesDetail.attributes)

    // let dataArray = data.map(obj =>
    //     `<div >
    //             <label class="form-label" for="form_${obj}">${obj}:</label>
    //             <input type="text" class="form-control" id="form_${obj}" name="${obj}" value=""><br>
    //     </div>`
    // );

    // const template = `  
    //     <div class="formNode card position-absolute">
    //         <div class="card-body">
    //             ${dataArray.join("")}
    //             <button type="submit" class="btn btn-primary FormNodeSubmit" value="submit">Submit</button>
    //         </div>
    //     </div>
    // `;


};

export default FormNode;

