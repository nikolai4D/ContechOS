import Actions from "../store/Actions.js";
import dropDown from "./DropDownField.js";
import inputField from "./InputField.js";
import getDefType from "./graphFunctions/getDefType.js";

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
    //TODO :

    // Check what attribute defid/deftypeid, check if is dependent on parentId, get parentId by clickedObj, get attribute+s from parentId. These are the keys. THEN, for the keys, get values.
    // Later, look 

    let keyOfAttribute = Object.keys(attribute)[0];
    let valueOfAttribute = Object.values(attribute)[0];
    let fieldTypeId = valueOfAttribute.fieldTypeId;
    let fieldType = fieldTypes.find(obj => obj.fieldTypeId === fieldTypeId).type;

    let fieldPropertiesOfAttribute = getFieldProperties(valueOfAttribute, fieldProperties);
    if (fieldPropertiesOfAttribute.some(obj => obj.type === 'hidden')) {
      continue;
    }


    if (fieldType === 'input') {
      createInput(fieldsArray, keyOfAttribute, defType, clickedObj)
    }
    else if (fieldType === 'dropDown') {
      const { defId, defTypeId } = valueOfAttribute;
      createDropdown(fieldsArray, keyOfAttribute, getDefType(defId, defTypeId));
    }
    else if (fieldType === 'dropDownMultiple') {
      const { defId, defTypeId } = valueOfAttribute;
      createDropdownMultiple(fieldsArray, keyOfAttribute, getDefType(defId, defTypeId));
    }
    else if (fieldType === 'dropDownKeyValue') {

      createDropdownKeyValue(fieldsArray, valueOfAttribute, clickedObj, defType);
    }
    else if (fieldType === 'externalNodeClick') {
      let htmlString = `<div style="display: flex; padding: 0.5em">
      <label class="form-label" for="field_${keyOfAttribute}">${keyOfAttribute}:</label>
      <input type="text" id="field_${keyOfAttribute}" class="form-control" name="field_${keyOfAttribute}" disabled value="Click target node"><br>
  </div>`;
      fieldsArray.push(htmlString);
    }
  }

  const template = `
  <div class="formCreate position-absolute">
        <div><h3>create: ${defType.defTypeTitle}</h3></div>
        <div class="card">
        <div class="card-body">
           <form id="formCreate" >
             ${fieldsArray.join("")}
                <button type="submit" class="btn btn-primary formCreateSubmit" value="submit">Submit</button>
            </form>
        </div>
        </div>
    </div>
`;
  return template;
}

export function getDefTypeFromSessionStorage(defType) {
  const defTypeTitle = getDefType(defType.defId, defType.defTypeId).defTypeTitle;
  Actions.GETALL(defTypeTitle);
  return JSON.parse(sessionStorage.getItem(`${defTypeTitle}`));
};

const createInput = (fieldsArray, keyOfAttr, defType, clickedObj) => {

  if (defType.defTypeTitle === 'instanceData') {
    fieldsArray.push(inputField(keyOfAttr, clickedObj.title, "disabled"));

  }
  else {
    fieldsArray.push(inputField(keyOfAttr))
  }
};

const createDropdown = (fieldsArray, keyOfAttribute, defType) => {
  let allNodesByDefType = getDefTypeFromSessionStorage(defType);

  // let dropDownString = dropDown(keyOfAttribute, allNodesByDefType);
  // fieldsArray.push(dropDownString);

  let dropDownString = ''
  if (defType.defTypeTitle === 'configObj') {
    dropDownString = dropDown(keyOfAttribute, allNodesByDefType, null, `${keyOfAttribute}_typeData`, '_typeData');

  }
  else {
    dropDownString = dropDown(keyOfAttribute, allNodesByDefType);
  }
  fieldsArray.push(dropDownString);
  fieldsArray.push(`<div id="field_filteredProps_typeData" name="field_filteredProps_typeData"></div>`);

}

const createDropdownMultiple = (fieldsArray, keyOfAttribute, defType) => {
  let allNodesByDefType = getDefTypeFromSessionStorage(defType);
  let dropDownString = dropDown(keyOfAttribute, allNodesByDefType, "multiple");
  fieldsArray.push(dropDownString);
}

const createDropdownKeyValue = (fieldsArray, valueOfAttribute, clickedObj, defType) => {
  let dropDownHtmlString = "";

  let allKeyIdsByParent = []
  let propsNodesRels = []
  if (defType.defTypeTitle === 'configObjInternalRel') {

    let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

    let parentConfigDefInternalRels = configRels.filter(rel => { return (rel.source === clickedObj.parentId && rel.target === clickedObj.parentId) })
    console.log(parentConfigDefInternalRels)

    let dropDownString = dropDown("configDefInternalRel", parentConfigDefInternalRels);
    fieldsArray.push(dropDownString);
    fieldsArray.push(`<div id="field_filteredProps" name="field_filteredProps"></div>`);

  }
  else if (defType.defTypeTitle === 'configObjExternalRel') {

    let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

    let parentConfigDefExternalRels = configRels.filter(rel => { return (rel.source === clickedObj.parentId && rel.target !== clickedObj.parentId) })
    console.log(parentConfigDefExternalRels)

    let dropDownString = dropDown("configDefExternalRel", parentConfigDefExternalRels);
    fieldsArray.push(dropDownString);
    fieldsArray.push(`<div id="field_filteredProps" name="field_filteredProps"></div>`);

    // propsNodesRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
    // let configDefRels = propsNodesRels.filter(rel => { return rel.defTypeTitle === 'configDefExternalRel' })
  }

  else if (defType.defTypeTitle === 'typeDataInternalRel') {

    let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
    console.log(clickedObj.parentId)

    let parentConfigDefInternalRels = configRels.filter(rel => { return (rel.defTypeTitle === 'configObjInternalRel' && (rel.source === clickedObj.parentId || rel.target === clickedObj.parentId)) })

    // let parentConfigDefInternalRels = configRels.filter(rel => { return (rel.source === clickedObj.parentId && rel.target === clickedObj.parentId) })
    console.log(parentConfigDefInternalRels)

    let dropDownString = dropDown("configObjInternalRel", parentConfigDefInternalRels);
    fieldsArray.push(dropDownString);
    fieldsArray.push(`<div id="field_filteredProps" name="field_filteredProps"></div>`);



  }

  else if (defType.defTypeTitle === 'instanceDataInternalRel') {

    let configRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;


    let parentConfigDefInternalRels = configRels.filter(rel => { return (rel.defTypeTitle === 'typeDataInternalRel' && (rel.source === clickedObj.parentId || rel.target === clickedObj.parentId)) })

    let dropDownString = dropDown("typeDataInternalRel", parentConfigDefInternalRels);
    fieldsArray.push(dropDownString);
    fieldsArray.push(`<div id="field_filteredProps" name="field_filteredProps"></div>`);

  }

  else if (defType.defTypeTitle === 'instanceDataExternalRel') {

    let configRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;


    let parentConfigDefExternalRels = configRels.filter(rel => { return (rel.defTypeTitle === 'typeDataExternalRel' && (rel.source === clickedObj.parentId || rel.target === clickedObj.parentId)) })

    let dropDownString = dropDown("typeDataExternalRel", parentConfigDefExternalRels);
    fieldsArray.push(dropDownString);
    fieldsArray.push(`<div id="field_filteredProps" name="field_filteredProps"></div>`);

  }

  else if (defType.defTypeTitle === 'typeDataExternalRel') {

    let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

    let parentConfigDefExternalRels = configRels.filter(rel => { return (rel.defTypeTitle === 'configObjExternalRel' && (rel.source === clickedObj.parentId || rel.target === clickedObj.parentId)) })
    console.log(parentConfigDefExternalRels)

    let dropDownString = dropDown("configObjExternalRel", parentConfigDefExternalRels);
    fieldsArray.push(dropDownString);
    fieldsArray.push(`<div id="field_filteredProps" name="field_filteredProps"></div>`);

    // propsNodesRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
    // let configDefRels = propsNodesRels.filter(rel => { return rel.defTypeTitle === 'configDefExternalRel' })
  }

  else if (clickedObj.defTypeTitle === 'configDef') {
    propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;

    let titleOfKeyAttribute = getDefType(valueOfAttribute.key.defId, valueOfAttribute.key.defTypeId).defTypeTitle;
    allKeyIdsByParent = clickedObj[`${titleOfKeyAttribute}s`]


    let allKeysByParent = propsNodesRels.filter(node => { return allKeyIdsByParent.includes(node.id) })

    allKeysByParent.forEach(propKey => {
      let filtered = propsNodesRels.filter(node => node.parentId === propKey.id)
      if (filtered.length > 0) {
        dropDownHtmlString += dropDown(propKey.title, filtered, null, propKey.id);
      }
    })
  }

  else if (clickedObj.defTypeTitle === 'typeData') {
    propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
    let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].nodes;

    let getParent = clickedObj.parentId

    let getParentsParent = configNodes.filter(node => node.id === getParent)

    let instanceDataPropKeys = getParentsParent[0].instanceDataPropKeys;

    let allKeysByParent = propsNodesRels.filter(node => { return instanceDataPropKeys.includes(node.id) })


    allKeysByParent.forEach(propKey => {
      let filtered = propsNodesRels.filter(node => node.parentId === propKey.id)
      if (filtered.length > 0) {
        dropDownHtmlString += dropDown(propKey.title, filtered, null, propKey.id);
      }
    })
  }


  fieldsArray.push(dropDownHtmlString);

};

export function getFieldProperties(valueOfAttribute, fieldProperties) {
  let type = []
  if (valueOfAttribute?.fieldProperties && valueOfAttribute.fieldProperties) {
    type = valueOfAttribute.fieldProperties.map((property) => {
      return fieldProperties.find(obj => obj.fieldPropertyId === property)
    })
  }
  return type
}
