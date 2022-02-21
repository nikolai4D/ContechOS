import Actions from "../store/Actions.js";
import dropDown from "./DropDownField.js";
import inputField from "./InputField.js";
import getDefType from "./graphfunctions/getDefType.js";

let definitions = "";

export function FormCreate(event, d, clickedObj) {
  // Getting definitions
  let fieldsArray = [];

  definitions = JSON.parse(sessionStorage.getItem("definitions"))[0];
  const defId = parseInt(d.target.attributes.getNamedItem("data-defid").value);
  const defTypeId = parseInt(
    d.target.attributes.getNamedItem("data-deftypeid").value
  );
  const defType = getDefType(defId, defTypeId);
  const { fieldTypes, fieldProperties } = definitions.fields;

  // initialise array to put fields into

  let defTypeAttributes = defType.attributes;

  for (let attribute of defTypeAttributes) {
    //   // for attribute in attributes,  get the key and the value. If the value is "hidden", skip it all together.
    let keyOfAttribute = Object.keys(attribute)[0];
    let valueOfAttribute = Object.values(attribute)[0];
    let fieldTypeId = valueOfAttribute.fieldTypeId;
    let fieldType = fieldTypes.find(obj => obj.fieldTypeId === fieldTypeId).type;

    if (fieldType === 'input') {
      createInput(fieldsArray, keyOfAttribute)
    }
    else if (fieldType === 'dropDown') {
      createDropdown(fieldsArray, getDefType(attribute.defId, attribute.defTypeId), keyOfAttribute, clickedObj);

    }
    else if (fieldType === 'dropDownMultiple') {
      const { defId, defTypeId } = valueOfAttribute;
      createDropdownMultiple(fieldsArray, keyOfAttribute, getDefType(defId, defTypeId));
    }
    else if (fieldType === 'dropDownKeyValue') {
      createDropdownKeyValue(fieldsArray, getDefType(valueOfAttribute.key.defId, valueOfAttribute.key.defTypeId), getDefType(valueOfAttribute.value.defId, valueOfAttribute.value.defTypeId));

    }
  }


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

function getDefTypeFromSessionStorage(defType) {
  const defTypeTitle = getDefType(defType.defId, defType.defTypeId).title;
  Actions.GETALL(defTypeTitle);
  return JSON.parse(sessionStorage.getItem(`${defTypeTitle}`));
};

const createInput = (fieldsArray, keyOfAttr) => {
  fieldsArray.push(inputField(keyOfAttr));
};

// const createDropdown = (fieldsArray, attribute, keyOfAttr, clickedObj) => {
//   let allNodesByDefType = attribute.filter(
//     (obj) => obj.id !== clickedObj.id
//   );
//   let dropDownString = dropDown(keyOfAttr, allNodesByDefType);
//   fieldsArray.push(dropDownString);
// }

const createDropdownMultiple = (fieldsArray, keyOfAttribute, defType) => {
  let allNodesByDefType = getDefTypeFromSessionStorage(defType);
  let dropDownString = dropDown(keyOfAttribute, allNodesByDefType, "multiple");
  fieldsArray.push(dropDownString);
}

const createDropdownKeyValue = (fieldsArray, key, value) => {
  let dropDownHtmlString = "";
  let allNodesByDefTypeKey = getDefTypeFromSessionStorage(key);
  let allNodesByDefTypeValue = getDefTypeFromSessionStorage(value);

  allNodesByDefTypeKey.forEach((propkey) => {
    let filtered = allNodesByDefTypeValue.filter(
      (propVal) => propVal.propKeyId === propkey.id
    );
    if (filtered.length > 0) {
      dropDownHtmlString += dropDown(propkey.title, filtered, null, propkey.id);
    }
  });
  fieldsArray.push(dropDownHtmlString);
};
