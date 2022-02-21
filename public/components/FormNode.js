import Actions from "../store/Actions.js";
import dropDown from "./DropDownField.js";
import inputField from "./InputField.js";
import getDefType from "./graphfunctions/getDefType.js";

let definitions = "";

export function FormNode(event, d, clickedObj) {
  // Getting definitions

  definitions = JSON.parse(sessionStorage.getItem("definitions"))[0];
  let typesDetail = [];
  const defId = parseInt(d.target.attributes.getNamedItem("data-defid").value);
  const defTypeId = parseInt(
    d.target.attributes.getNamedItem("data-deftypeid").value
  );

  const defType = getDefType(defId, defTypeId);

  // initialise array to put fields into
  let fieldsArray = [];

  let defTypeAttrs = defType.attributes;

  // Run function that gives all of the different field
  updateFieldsArray(defTypeAttrs, fieldsArray, clickedObj);

  async function updateFieldsArray(defTypeAttrs, fieldsArray, clickedObj) {
    /*
    Gets fields:
      - input
      - dropdowns
      - dropdowns with multiple choice
      - dropdowns as "key - value", where "key" is a label
    */

    for (let obj of defTypeAttrs) {
      // for attribute in attributes,  get the key and the value. If the value is "hidden", skip it all together.

      let keyOfAttr = Object.keys(obj)[0];
      let valueOfAttr = Object.values(obj)[0];
      if (valueOfAttr["hidden"]) {
        continue;
      }

      if (typeof valueOfAttr === "string") {
        // Returns input forms
        createInput(fieldsArray, keyOfAttr);
      } else if (Array.isArray(valueOfAttr)) {
        if (valueOfAttr[0]["defTypeId"]) {
          // Returns dropwdowns with multiple choice
          createDropdownMultiple(fieldsArray, valueOfAttr[0], keyOfAttr);
        } else {
          createDropdownKeyValue(
            fieldsArray,
            valueOfAttr[0].key,
            valueOfAttr[0].value
          );
        }
      } else if (typeof valueOfAttr === "object") {
        // Returns single dropdown
        createDropdown(fieldsArray, valueOfAttr, keyOfAttr, clickedObj);
      }
    }
  }

  //   let arrayWithEntries = defType.attributes;
  //   console.log(arrayWithEntries);

  const template = `
  <div class="formNode position-absolute">
        <div><h3>create: ${defType.title}</h3></div>
        <div class="card">
        <div class="card-body">
           <form id="formNode" >
             ${fieldsArray.join("")}
                <button type="submit" class="btn btn-primary FormNodeSubmit" value="submit">Submit</button>
            </form>
        </div>
        </div>
    </div>
`;
  return template;
}

// export function getTypeDetails(id, types, typeId) {
//   // Getting details about rel/nodetype by comparing id in definitions (to later take out attributes)
//   return definitions[types].find((obj) => {
//     return obj[typeId] === id;
//   });
// }

// export function getDefTypesAttrs(defType) {
//   console.log(defType);
//   //const nodeType = getTypeDetails(nodeTypeId, "nodeTypes", "nodeTypeId").title;
//   Actions.GETALL(defType.title);
//   return JSON.parse(sessionStorage.getItem(`${defType.title}`));
// }

async function getDefTypeFromSessionStorage(defType) {
  const defTypeTitle = getDefType(defType.defId, defType.defTypeId).title;
  await Actions.GETALL(defTypeTitle);
  return JSON.parse(sessionStorage.getItem(`${defTypeTitle}`));
}

function createInput(fieldsArray, keyOfAttr) {
  fieldsArray.push(inputField(keyOfAttr));
}

// function createDropdown(fieldsArray, id, keyOfAttr, clickedObj) {
//   let allNodesByType = getDefTypesAttrs(id).filter(
//     (obj) => obj.id !== clickedObj.id
//   );
//   let dropDownString = dropDown(keyOfAttr, allNodesByType);
//   fieldsArray.push(dropDownString);
// }

function createDropdownMultiple(fieldsArray, id, keyOfAttr) {
  let allNodesByType = getDefTypeFromSessionStorage(defType);
  let dropDownString = dropDown(keyOfAttr, allNodesByType, "multiple");
  fieldsArray.push(dropDownString);
}

function createDropdownKeyValue(fieldsArray, key, value) {
  let astring = "";
  let allNodesByTypeKey = getDefTypesAttrs(key);
  getDefTypeFromSessionStorage(defType);
  let allNodesByTypeValue = getDefTypesAttrs(value);
  getDefTypeFromSessionStorage(defType);

  allNodesByTypeKey.forEach((propkey) => {
    let filtered = allNodesByTypeValue.filter(
      (propVal) => propVal.propKeyId === propkey.id
    );
    if (filtered.length > 0) {
      astring += dropDown(propkey.title, filtered, null, propkey.id);
    }
  });
  fieldsArray.push(astring);
}
