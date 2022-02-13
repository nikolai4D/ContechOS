import nodeDefs from "../store/definitions.js";
import Actions from "../store/Actions.js";
import dropDownKeyValue from "./DropDownFieldKeyValue.js";
import dropDown from "./DropDownField.js"
import inputField from "./InputField.js";

export function getNodeTypeDetails(id) {
    return nodeDefs.nodeTypes.find(obj => {
        return obj.nodeTypeId === id;
    })
};

const getNodeTypesAttrs = (nodeTypeId) => {
    const nodeType = (getNodeTypeDetails(nodeTypeId)).title;
    Actions.GETALL(nodeType);
    return JSON.parse(sessionStorage.getItem(`${nodeType}`));
}

export function FormNode(d) {

    const nodeTypesDetail = getNodeTypeDetails(parseInt(d.target.id))
    console.log(nodeTypesDetail, 'nodeTypesDetails')

    let arrayWithEntries = nodeTypesDetail.attributes
    console.log(arrayWithEntries, 'arrayWithEntries')

    let fieldsArray = [];

    arrayWithEntries.forEach(obj => {
        let keyOfAttr = Object.keys(obj)[0];
        let valueOfAttr = Object.values(obj)[0];

        if (typeof (valueOfAttr) === 'string') {
            // Returns input forms
            fieldsArray.push(inputField(keyOfAttr));
        }
        else if (Array.isArray(valueOfAttr)) {
            if (valueOfAttr[0]['nodeTypeId']) {
                // Returns dropwdowns with multiple choice
                let allNodesByType = getNodeTypesAttrs(valueOfAttr[0]['nodeTypeId']);
                let dropDownString = dropDown(keyOfAttr, allNodesByType, "multiple")
                console.log('dropDownString', dropDownString)
                fieldsArray.push(dropDownString);
            }
            else {
                // Returns 2 dropdowns as key and value pair, with "Add more props" button
                fieldsArray.push(dropDownKeyValue(keyOfAttr, valueOfAttr[0].key.title, valueOfAttr[0].value.title))
            }
        }
        else if (typeof (valueOfAttr) === 'object') {
            // Returns single dropdown

            fieldsArray.push(dropDown(keyOfAttr, []))
        }
    });
    console.log(fieldsArray.join(""))

    const template = `  
    <div class="formNode card position-absolute">
        <div class="card-body">
           <form id="formNode" >
             ${fieldsArray.join("")}
                <button type="submit" class="btn btn-primary FormNodeSubmit" value="submit">Submit</button>
            </form>
        </div>
    </div>
`;
    return template;



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

