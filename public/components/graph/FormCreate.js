import Actions from "../../store/Actions.js";
import dropDown from "./DropDownField.js";
import inputField from "./InputField.js";
import getDefType from "./graphFunctions/getDefType.js";
import { State } from '../../store/State.js';
import getFieldProperties from './graphFunctions/getFieldProperties.js';
import { getDefTypeFromSessionStorage } from './graphFunctions/getDefTypeFromSessionStorage.js';


export function FormCreate() {
  const { attributes } = State.contextMenuItem.target;
  State.definitions = JSON.parse(sessionStorage.getItem("definitions"))[0];
  let fieldsArray = [];

  const defId = parseInt(attributes.getNamedItem("data-defid").value);
  const defTypeId = parseInt(attributes.getNamedItem("data-deftypeid").value);
  const defType = getDefType(defId, defTypeId);
  const { fieldTypes, fieldProperties } = State.definitions.fields;
  let defTypeAttributes = defType.attributes;

  for (let attribute of defTypeAttributes) {
    let displayTitle = (Object.values(attribute)[0].displayTitle) ? Object.values(attribute)[0].displayTitle : Object.keys(attribute)[0];
    let keyOfAttribute = Object.keys(attribute)[0];
    let valueOfAttribute = Object.values(attribute)[0];
    let fieldTypeId = valueOfAttribute.fieldTypeId;
    let fieldType = fieldTypes.find((obj) => obj.fieldTypeId === fieldTypeId)
      .type;

    let fieldPropertiesOfAttribute = getFieldProperties(
      valueOfAttribute,
      fieldProperties
    );

    if (fieldPropertiesOfAttribute.some((obj) => obj.type === "hidden")) {
      continue;
    }
    if (fieldPropertiesOfAttribute.some((obj) => obj.type === "dependant")) {
      fieldsArray.push(`<div id='field_${keyOfAttribute}'></div>`);
      continue;
    }
    if (defId === 2) {
    }

    if (fieldType === "input") {
      createInput(displayTitle, fieldsArray, keyOfAttribute, defType, State.clickedObj);
    } else if (fieldType === "dropDown") {
      const { defId, defTypeId } = valueOfAttribute;
      createDropdown(fieldsArray, keyOfAttribute, getDefType(defId, defTypeId), displayTitle);
    } else if (fieldType === "dropDownMultiple") {
      const { defId, defTypeId } = valueOfAttribute;
      createDropdownMultiple(
        fieldsArray,
        keyOfAttribute,
        getDefType(defId, defTypeId),
        displayTitle,
        defId
      );
    } else if (fieldType === "dropDownKeyValue") {
      createDropdownKeyValue(
        fieldsArray,
        valueOfAttribute,
        State.clickedObj,
        defType
      );
    } else if (fieldType === "externalNodeClick") {

      let htmlString =
        `<div style="display: flex; padding: 0.5em">
          <div>
            <label class="form-text" for="field_${keyOfAttribute}">${displayTitle}:</label>
            <input type="text" id="field_${keyOfAttribute}" class="form-control-plaintext  p-1 bg-light rounded" name="field_${keyOfAttribute}" disabled value="Click target node"><br>
          </div>
        </div>
    `;
      fieldsArray.push(htmlString);
    }
  }

  const template = `
  <div class="formCreate position-absolute">
        <div><h5>+ ${defType.defTypeDisplayTitle.replace('Internal ', '').replace('External ', '')}</h5></div>
        <div class="card">
        <div class="card-body">
           <form id="formCreate" >
             ${fieldsArray.join("")}
                <button type="submit" class="btn btn-primary formCreateSubmit" value="submit">Submit</button>
                <button class="btn btn-danger form-close-button">Close</button>

            </form>
        </div>
        </div>
    </div>
`;
  return template;
}

const createInput = (displayTitle, fieldsArray, keyOfAttr) => {

  fieldsArray.push(inputField(displayTitle, keyOfAttr));

};

const createDropdown = (fieldsArray, keyOfAttribute, defType, displayTitle) => {
  let allNodesByDefType = getDefTypeFromSessionStorage(defType);

  let dropDownString = "";
  if (defType.defTypeTitle === "configObj") {
    dropDownString = dropDown(
      displayTitle,
      keyOfAttribute,
      allNodesByDefType,
      null,
      `${keyOfAttribute}_typeData`,
      "_typeData"
    );
  } else {
    dropDownString = dropDown(displayTitle, keyOfAttribute, allNodesByDefType);
  }
  fieldsArray.push(dropDownString);
  fieldsArray.push(
    `<div id="field_filteredProps_typeData" name="field_filteredProps_typeData"></div>`
  );
};

const createDropdownMultiple = (fieldsArray, keyOfAttribute, defType, displayTitle, defId) => {
  let validPropKeys = getDefTypeFromSessionStorage(defType);
  let type;
  if (defId === 1) {
    type = "nodes"
  }
  else {
    type = "rels"
  }
  // Check if propKey has propVals. If not -> don't include in dropdown

  const recordsInView = JSON.parse(sessionStorage.getItem("props"))[0][type];
  let allPropKeysWithVals = [];
  recordsInView.forEach(prop => { if (prop.id.substring(0, 2) === 'pv') { allPropKeysWithVals.push(prop.parentId) } })
  allPropKeysWithVals = [...new Set(allPropKeysWithVals)];
  validPropKeys = recordsInView.filter(prop => allPropKeysWithVals.includes(prop.id))



  let dropDownString = dropDown(displayTitle, keyOfAttribute, validPropKeys, "multiple");
  fieldsArray.push(dropDownString);
};

const createDropdownKeyValue = (
  fieldsArray,
  valueOfAttribute,
  defType
) => {
  let dropDownHtmlString = "";

  let allKeyIdsByParent = [];
  let propsNodesRels = [];
  if (defType.defTypeTitle === "configObjInternalRel") {
    let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

    let parentConfigDefInternalRels = configRels.filter((rel) => {
      return (
        rel.source === State.clickedObj.parentId && rel.target === State.clickedObj.parentId
      );
    });

    let dropDownString = dropDown(
      "configDefInternalRel",
      "configDefInternalRel",
      parentConfigDefInternalRels
    );
    fieldsArray.push(dropDownString);
    fieldsArray.push(
      `<div id="field_filteredProps" name="field_filteredProps"></div>`
    );
  } else if (defType.defTypeTitle === "configObjExternalRel") {
    let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

    let parentConfigDefExternalRels = configRels.filter((rel) => {
      return (
        rel.source === State.clickedObj.parentId && rel.target !== State.clickedObj.parentId
      );
    });

    let dropDownString = dropDown(
      "configDefExternalRel",
      "configDefExternalRel",
      parentConfigDefExternalRels
    );
    fieldsArray.push(dropDownString);
    fieldsArray.push(
      `<div id="field_filteredProps" name="field_filteredProps"></div>`
    );

  } else if (defType.defTypeTitle === "typeDataInternalRel") {
    let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

    let parentConfigDefInternalRels = configRels.filter((rel) => {
      return (
        rel.defTypeTitle === "configObjInternalRel" &&
        (rel.source === State.clickedObj.parentId ||
          rel.target === State.clickedObj.parentId)
      );
    });


    let dropDownString = dropDown(
      "configObjInternalRel",
      "configObjInternalRel",
      parentConfigDefInternalRels
    );
    fieldsArray.push(dropDownString);
    fieldsArray.push(
      `<div id="field_filteredProps" name="field_filteredProps"></div>`
    );
  } else if (defType.defTypeTitle === "instanceDataInternalRel") {
    let configRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;

    let parentConfigDefInternalRels = configRels.filter((rel) => {
      return (
        rel.defTypeTitle === "typeDataInternalRel" &&
        (rel.source === State.clickedObj.parentId ||
          rel.target === State.clickedObj.parentId)
      );
    });

    let dropDownString = dropDown(
      "typeDataInternalRel",
      "typeDataInternalRel",
      parentConfigDefInternalRels
    );
    fieldsArray.push(dropDownString);
    fieldsArray.push(
      `<div id="field_filteredProps" name="field_filteredProps"></div>`
    );
  } else if (defType.defTypeTitle === "instanceDataExternalRel") {
    let configRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;

    let parentConfigDefExternalRels = configRels.filter((rel) => {
      return (
        rel.defTypeTitle === "typeDataExternalRel" &&
        (rel.source === State.clickedObj.parentId ||
          rel.target === State.clickedObj.parentId)
      );
    });

    let dropDownString = dropDown(
      "typeDataExternalRel",
      "typeDataExternalRel",
      parentConfigDefExternalRels
    );
    fieldsArray.push(dropDownString);
    fieldsArray.push(
      `<div id="field_filteredProps" name="field_filteredProps"></div>`
    );
  } else if (defType.defTypeTitle === "typeDataExternalRel") {
    let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

    let parentConfigDefExternalRels = configRels.filter((rel) => {
      return (
        rel.defTypeTitle === "configObjExternalRel" &&
        (rel.source === State.clickedObj.parentId ||
          rel.target === State.clickedObj.parentId)
      );
    });

    let dropDownString = dropDown(
      "configObjExternalRel",
      "configObjExternalRel",
      parentConfigDefExternalRels
    );
    fieldsArray.push(dropDownString);
    fieldsArray.push(
      `<div id="field_filteredProps" name="field_filteredProps"></div>`
    );

  } else if (State.clickedObj.defTypeTitle === "configDef") {
    propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;

    let titleOfKeyAttribute = getDefType(
      valueOfAttribute.key.defId,
      valueOfAttribute.key.defTypeId
    ).defTypeTitle;

    allKeyIdsByParent = State.clickedObj[`${titleOfKeyAttribute}s`];
    let allKeysByParent = propsNodesRels.filter((node) => {
      return allKeyIdsByParent.includes(node.id);
    });

    allKeysByParent.forEach((propKey) => {
      let filtered = propsNodesRels.filter(
        (node) => node.parentId === propKey.id
      );
      if (filtered.length > 0) {
        dropDownHtmlString += dropDown(
          propKey.title,
          propKey.title,
          filtered,
          null,
          propKey.id,
        );
      }
    });
  } 
   // this part is for creating typeData directly from configObj (different from other views)
  else if (State.clickedObj.defTypeTitle === "configObj" && window.location.pathname === "/filter") {
    generateDropdownTypeDataPropKeys();
  }
  
  else if (State.clickedObj.defTypeTitle === "typeData") {
    propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
    let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].nodes;

    let getParent = State.clickedObj.parentId;

    let getParentsParent = configNodes.filter((node) => node.id === getParent);
    let instanceDataPropKeys = getParentsParent[0].instanceDataPropKeys;

    let allKeysByParent = propsNodesRels.filter((node) => {
      return instanceDataPropKeys.includes(node.id);
    });

    allKeysByParent.forEach((propKey) => {
      let filtered = propsNodesRels.filter(
        (node) => node.parentId === propKey.id
      );
      if (filtered.length > 0) {
        dropDownHtmlString += dropDown(
          propKey.title,
          propKey.title,
          filtered,
          null,
          propKey.id
        );
      }
    });
  }
  fieldsArray.push(dropDownHtmlString);

  /**
   * Summary. Generates drop down from propKeys. Gets typeDataPropKeys from parent into the "create" form to then pick prop value from (drop down).
   *  @return {string} Appends to variable "dropDownHtmlString"
   *  @param {string} dropDownHtmlString
  */
  function generateDropdownTypeDataPropKeys() {
    propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;

    let getParent = State.clickedObj;

    let typeDataPropKeys = getParent.typeDataPropKeys;

    let allKeysByParent = propsNodesRels.filter((node) => {
      return typeDataPropKeys.includes(node.id);
    });

    allKeysByParent.forEach((propKey) => {
      let filtered = propsNodesRels.filter(
        (node) => node.parentId === propKey.id
      );

      if (filtered.length > 0) {
        dropDownHtmlString += dropDown(
          propKey.title,
          propKey.title,
          filtered,
          null,
          propKey.id
        );
      }
    });
  }
};
