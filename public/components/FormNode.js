//import nodeDefs from "../store/definitions.js";
import Actions from "../store/Actions.js";
import dropDownKeyValue from "./DropDownFieldKeyValue.js";
import dropDown from "./DropDownField.js";
import inputField from "./InputField.js";

let nodeDefs = "";
export function getTypeDetails(id, types, typeId) {
  return nodeDefs[types].find((obj) => {
    return obj[typeId] === id;
  });
}

const getNodeTypesAttrs = (nodeTypeId) => {

  const nodeType = getTypeDetails(nodeTypeId, "nodeTypes", "nodeTypeId").title;
  Actions.GETALL(nodeType);
  return JSON.parse(sessionStorage.getItem(`${nodeType}`));
};

function updateFieldsArray(arrayWithEntries, fieldsArray, clickedObj) {
  for (let obj of arrayWithEntries) {
    let keyOfAttr = Object.keys(obj)[0];
    let valueOfAttr = Object.values(obj)[0];
    if (valueOfAttr["hidden"]) {
      continue;
    }

    if (typeof valueOfAttr === "string") {
      // Returns input forms
      fieldsArray.push(inputField(keyOfAttr));
    } else if (Array.isArray(valueOfAttr)) {
      if (valueOfAttr[0]["nodeTypeId"]) {
        // Returns dropwdowns with multiple choice
        let allNodesByType = getNodeTypesAttrs(valueOfAttr[0]["nodeTypeId"]);
        let dropDownString = dropDown(keyOfAttr, allNodesByType, "multiple");
        fieldsArray.push(dropDownString);
      } else {

        let allNodesByTypeKey = getNodeTypesAttrs(valueOfAttr[0].key["nodeTypeId"])
        let allNodesByTypeValue = getNodeTypesAttrs(valueOfAttr[0].value["nodeTypeId"])

        // Returns 2 dropdowns as key and value pair, with "Add more props" button

        dropDownKeyValue(
          keyOfAttr,
          allNodesByTypeKey,
          allNodesByTypeValue
        )

        let astring = '';

        allNodesByTypeKey.forEach(propkey => {
          console.log(propkey)
          console.log(allNodesByTypeValue)
          let filtered = allNodesByTypeValue.filter(propVal => propVal.propKeyId === propkey.id)
          console.log(filtered)
          if (filtered.length > 0) {
            astring += dropDown(propkey.title, filtered, null, propkey.id)
          }
        })

        // dropDown(keyOfAttr, allNodesByTypeKey)

        fieldsArray.push(astring);
      }
    } else if (typeof valueOfAttr === "object") {
      // Returns single dropdown

      let allNodesByType = getNodeTypesAttrs(valueOfAttr["nodeTypeId"]).filter(
        (obj) => obj.id !== clickedObj.id
      );

      let dropDownString = dropDown(keyOfAttr, allNodesByType);
      fieldsArray.push(dropDownString);
    }
  }
}

export function FormNode(event, d, clickedObj) {
  nodeDefs = JSON.parse(sessionStorage.getItem("definitions"))[0];
  let typesDetail = [];
  //   await getNodeDefs();

  if (event.target.tagName === "circle") {
    typesDetail = getTypeDetails(
      parseInt(d.target.id),
      "relTypes",
      "relTypeId"
    );
  } else if (event.target.tagName === "svg") {
    typesDetail = getTypeDetails(
      parseInt(d.target.id),
      "nodeTypes",
      "nodeTypeId"
    );
  }

  let arrayWithEntries = typesDetail.attributes;

  let fieldsArray = [];

  updateFieldsArray(arrayWithEntries, fieldsArray, clickedObj);

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

  // const data = Object.keys(typesDetail.attributes)

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
}
