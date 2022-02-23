import Actions from "../../store/Actions.js";
import getDefType from "./getDefType.js";
import { getFieldProperties, getDefTypeFromSessionStorage } from "../FormCreate.js";

import { select } from "https://cdn.skypack.dev/d3@6";
let definitions = "";

const formCreateFunction = async (view, d, type, clickedObj, propKeys) => {
  event.preventDefault();
  const formData = document.getElementById("formCreate");


  definitions = JSON.parse(sessionStorage.getItem("definitions"))[0];
  const defId = parseInt(d.target.attributes.getNamedItem("data-defid").value);
  const defTypeId = parseInt(
    d.target.attributes.getNamedItem("data-deftypeid").value
  );
  const defType = getDefType(defId, defTypeId);
  const { fieldTypes, fieldProperties } = definitions.fields;

  let defTypeAttributes = defType.attributes;
  let formDataObj = {};
  console.log(defType)

  for (let attribute of defTypeAttributes) {
    //   // for attribute in attributes,  get the key and the value. If the value is "hidden", skip it all together.
    let attrValue = "";

    let keyOfAttribute = Object.keys(attribute)[0];
    let valueOfAttribute = Object.values(attribute)[0];
    let fieldTypeId = valueOfAttribute.fieldTypeId;
    let fieldType = fieldTypes.find(obj => obj.fieldTypeId === fieldTypeId).type;

    let fieldPropertiesOfAttribute = getFieldProperties(valueOfAttribute, fieldProperties)
    if (fieldPropertiesOfAttribute.some(obj => obj.type === 'hidden')) {
      if (defType.defTypeTitle === 'configObjInternalRel' && keyOfAttribute === 'parentId') {

        formDataObj['parentId'] = formData[`field_configDefInternalRel`].value;
      }
      else if (defType.defTypeTitle === 'configObjExternalRel' && keyOfAttribute === 'parentId') {
        formDataObj['parentId'] = formData[`field_configDefExternalRel`].value;

      }
      else if (defType.defTypeTitle === 'typeDataInternalRel' && keyOfAttribute === 'parentId') {
        formDataObj['parentId'] = formData[`field_configObjInternalRel`].value;

      }
      else if (defType.defTypeTitle === 'typeDataExternalRel' && keyOfAttribute === 'parentId') {
        formDataObj['parentId'] = formData[`field_configObjExternalRel`].value;

      }
      else if (defType.defTypeTitle === 'instanceDataInternalRel' && keyOfAttribute === 'parentId') {
        formDataObj['parentId'] = formData[`field_typeDataInternalRel`].value;

      }

      else {
        formDataObj[keyOfAttribute] = clickedObj.id; //source, parentId

      }
    }
    else {
      console.log(keyOfAttribute, defType.defTypeTitle)
      if (keyOfAttribute === 'parentId' && defType.defTypeTitle === 'typeData') {
        formDataObj['parentId'] = formData[`field_parentId_typeData`].value;

      }
      else {
        let formAttr = formData[`field_${keyOfAttribute}`];

        if (fieldType === 'input' || fieldType === 'dropDown' || fieldType === 'externalNodeClick') {
          attrValue = formAttr.value;
        }
        else if (fieldType === 'dropDownMultiple') {
          attrValue = await [...formAttr.selectedOptions].map(
            (option) => option.value
          )
        }
        else if (fieldType === 'dropDownKeyValue') {
          console.log(defType.defTypeTitle)
          if (defType.defTypeTitle === 'configObjInternalRel' || defType.defTypeTitle === 'configObjExternalRel' || defType.defTypeTitle === 'typeData' || defType.defTypeTitle === 'typeDataInternalRel' || defType.defTypeTitle === 'typeDataExternalRel' || defType.defTypeTitle === 'instanceDataInternalRel') {

            let props = propKeys.map(propKey => {
              let theKey = propKey.id;
              let theValue = formData[`field_${propKey.title}`].value;
              return { [theKey]: theValue }
            })
            keyOfAttribute = "props"
            attrValue = props
          }

          else if (defType.defTypeTitle === 'instanceData') {

            let propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
            let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].nodes;

            let getParent = clickedObj.parentId

            let getParentsParent = configNodes.filter(node => node.id === getParent)

            let instanceDataPropKeys = getParentsParent[0].instanceDataPropKeys;

            let allKeysByParent = propsNodesRels.filter(node => { return instanceDataPropKeys.includes(node.id) })

            let propKeyList = allKeysByParent.filter(propKey => {
              let filtered = propsNodesRels.filter(node => node.parentId === propKey.id)
              if (filtered.length > 0) {
                return filtered
              }
            })
            let props = propKeyList.map((propKey) => {
              let propKeyId = propKey.id;
              let propValue = formData[`field_${propKey.title}`].value;
              return { [propKeyId]: propValue };
            });
            attrValue = props;

          }
          else {

            let propsNodes = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
            let titleOfKeyAttribute = getDefType(valueOfAttribute.key.defId, valueOfAttribute.key.defTypeId).defTypeTitle;
            let allKeyIdsByParent = clickedObj[`${titleOfKeyAttribute}s`]

            let allKeysByParent = propsNodes.filter(node => { return allKeyIdsByParent.includes(node.id) })

            let propKeyList = allKeysByParent.filter(propKey => {
              let filtered = propsNodes.filter(node => node.parentId === propKey.id)
              if (filtered.length > 0) {
                return filtered;
              }
            })

            let props = propKeyList.map((propKey) => {
              let propKeyId = propKey.id;
              let propValue = formData[`field_${propKey.title}`].value;
              return { [propKeyId]: propValue };
            });
            attrValue = props;
          }
        }
        formDataObj[keyOfAttribute] = attrValue;
      }
    }
  }
  console.log(formDataObj)

  await Actions.CREATE(view, defType.defTypeTitle, await formDataObj);
  select(".FormMenuContainer").remove();
};

export default formCreateFunction;
