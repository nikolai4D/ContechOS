import nodeDefs from "../store/definitions.js";

const FormNode = (d) => {

    const nodeTypesDetail = nodeDefs.nodeTypes.find(obj => {
        return obj.nodeTypeId === parseInt(d.target.id);
    });
    const data = Object.keys(nodeTypesDetail.attributes)

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

                if Array:
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

