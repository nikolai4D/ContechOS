import Actions from "../store/Actions.js";
import dropDown from "./DropDownField.js";
import inputField from "./InputField.js";

let nodeDefs = "";

export function FormNode(event, d, clickedObj) {
  // Getting definitions 

  nodeDefs = JSON.parse(sessionStorage.getItem("definitions"))[0];
  let typesDetail = [];

  if (event.target.tagName === "circle") {
    // Get details of reltype of contextmenu item 

    typesDetail = getTypeDetails(
      parseInt(d.target.id),
      "relTypes",
      "relTypeId"
    );
  } else if (event.target.tagName === "svg") {
    // Get details of nodetype of contextmenu item 

    typesDetail = getTypeDetails(
      parseInt(d.target.id),
      "nodeTypes",
      "nodeTypeId"
    );
  }

  // Get the attributes of that rel/nodetype to later loop throufg
  let arrayWithEntries = typesDetail.attributes;

  // initialise array to put fields into
  let fieldsArray = [];

  // Run function that gives all of the different field
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
}

export function getTypeDetails(id, types, typeId) {
  // Getting details about rel/nodetype by comparing id in definitions (to later take out attributes)
  return nodeDefs[types].find((obj) => {
    return obj[typeId] === id;
  });
}

export function getNodeTypesAttrs(nodeTypeId) {

  const nodeType = getTypeDetails(nodeTypeId, "nodeTypes", "nodeTypeId").title;
  Actions.GETALL(nodeType);
  return JSON.parse(sessionStorage.getItem(`${nodeType}`));
};

function createInput(fieldsArray, keyOfAttr) {
  fieldsArray.push(inputField(keyOfAttr));
}

function createDropdown(fieldsArray, id, keyOfAttr, clickedObj) {
  let allNodesByType = getNodeTypesAttrs(id).filter(
    (obj) => obj.id !== clickedObj.id
  );
  let dropDownString = dropDown(keyOfAttr, allNodesByType);
  fieldsArray.push(dropDownString);
}

function createDropdownMultiple(fieldsArray, id, keyOfAttr) {
  let allNodesByType = getNodeTypesAttrs(id);
  let dropDownString = dropDown(keyOfAttr, allNodesByType, "multiple");
  fieldsArray.push(dropDownString);
}

function createDropdownKeyValue(fieldsArray, key, value) {
  let astring = '';
  let allNodesByTypeKey = getNodeTypesAttrs(key)
  let allNodesByTypeValue = getNodeTypesAttrs(value)

  allNodesByTypeKey.forEach(propkey => {
    let filtered = allNodesByTypeValue.filter(propVal => propVal.propKeyId === propkey.id)
    if (filtered.length > 0) {
      astring += dropDown(propkey.title, filtered, null, propkey.id)
    }
  })
  fieldsArray.push(astring);
}


async function updateFieldsArray(arrayWithEntries, fieldsArray, clickedObj) {
  /*
  Gets fields:
    - input
    - dropdowns
    - dropdowns with multiple choice
    - dropdowns as "key - value", where "key" is a label
  */
  arrayWithEntries.forEach(attr => {
    let keyOfAttr = Object.keys(attr)[0];
    let valueOfAttr = Object.values(attr)[0];

    if (typeof valueOfAttr === "string") {
      console.log('hello')
    }
    else if (Array.isArray(valueOfAttr)) {
      if (valueOfAttr[0]["nodeTypeId"]) {
        getNodeTypesAttrs(valueOfAttr[0]["nodeTypeId"])

      }
      else {
        getNodeTypesAttrs(valueOfAttr[0].key["nodeTypeId"])
        getNodeTypesAttrs(valueOfAttr[0].value["nodeTypeId"])

      }
    }
    else if (typeof valueOfAttr === "object") {
      getNodeTypesAttrs(valueOfAttr["nodeTypeId"])

    }
  })

  for (let obj of arrayWithEntries) {
    // for attribute in attributes,  get the key and the value. If the value is "hidden", skip it all together.

    let keyOfAttr = Object.keys(obj)[0];
    let valueOfAttr = Object.values(obj)[0];
    if (valueOfAttr["hidden"]) {
      continue;
    }

    if (typeof valueOfAttr === "string") {
      // Returns input forms
      createInput(fieldsArray, keyOfAttr)
    }
    else if (Array.isArray(valueOfAttr)) {
      if (valueOfAttr[0]["nodeTypeId"]) {
        // Returns dropwdowns with multiple choice
        createDropdownMultiple(fieldsArray, valueOfAttr[0]["nodeTypeId"], keyOfAttr)
      }
      else {
        createDropdownKeyValue(fieldsArray, valueOfAttr[0].key["nodeTypeId"], valueOfAttr[0].value["nodeTypeId"])
      }
    }
    else if (typeof valueOfAttr === "object") {
      // Returns single dropdown
      createDropdown(fieldsArray, valueOfAttr["nodeTypeId"], keyOfAttr, clickedObj)
    }
  }
}