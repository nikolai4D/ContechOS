import Actions from "../../../store/Actions.js";
import getDefType from "./getDefType.js";
import getFieldProperties from './getFieldProperties.js';
import { State } from '../../../store/State.js';
let definitions = "";
import { select } from "https://cdn.skypack.dev/d3@6";

const formSaveEditFunction = async (view, d, type, clickedObj, propKeys) => {
  event.preventDefault();
  const formData = document.getElementById("formEdit");


  definitions = JSON.parse(sessionStorage.getItem("definitions"))[0];

  let { defId, defTypeTitle } = State.clickedObj

  let defNode = definitions.defs.find((obj) => obj.def === "node");
  let defRel = definitions.defs.find((obj) => obj.def === "rel");

  let defTypeNode = defNode.defTypes.find((obj) => obj.defTypeTitle === defTypeTitle);
  let defTypeRel = defRel.defTypes.find((obj) => obj.defTypeTitle === defTypeTitle);

  let defType = defTypeNode ? defTypeNode : defTypeRel;

  const { fieldTypes, fieldProperties } = definitions.fields;

  let defTypeAttributes = defType.attributes;
  let formDataObj = {};

  if (defId === 1) {
    State.validDefTypeRels = null
  }
  else {
    defId === 2
  }

  for (let attribute of defTypeAttributes) {
    //   // for attribute in attributes,  get the key and the value. If the value is "hidden", skip it all together.
    let attrValue = "";
    formDataObj['parentId'] = State.clickedObj.parentId;

    let keyOfAttribute = Object.keys(attribute)[0];
    let valueOfAttribute = Object.values(attribute)[0];
    let fieldTypeId = valueOfAttribute.fieldTypeId;
    let fieldType = fieldTypes.find(obj => obj.fieldTypeId === fieldTypeId).type;

    let fieldPropertiesOfAttribute = getFieldProperties(valueOfAttribute, fieldProperties)



    let formAttr = formData[`field_${keyOfAttribute}`];

    if (keyOfAttribute === 'target') {
      attrValue = formAttr.getAttribute('data-id');

    }
    else if (keyOfAttribute === 'parentId') {

    }

    else if (fieldType === 'input' || fieldType === 'dropDown' || fieldType === 'externalNodeClick') {
      console.log(keyOfAttribute)
      attrValue = formAttr.value;
    }

    else if (fieldType === 'dropDownMultiple') {
      attrValue = await [...formAttr.selectedOptions].map(
        (option) => option.value
      )
    }
    else if (fieldType === 'dropDownKeyValue') {
      if (defType.defTypeTitle === 'typeDataInternalRel' || defType.defTypeTitle === 'typeDataExternalRel') {


        let propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
        let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let props = State.clickedObj.props
        let parentId = State.clickedObj.parentId;

        let parentObj = configNodes.find((node) => node.id === parentId);

        let typeDataRelPropKeys = parentObj.typeDataRelPropKeys;

        let allKeysByParent = propsNodesRels.filter((node) => {
          return typeDataRelPropKeys.includes(node.id);
        });

        let propKeyList = allKeysByParent.filter((propKey) => {
          let filtered = propsNodesRels.filter(
            (node) => node.parentId === propKey.id
          );
          filtered = filtered.map(node => {
            let selected = props.find(prop =>
              node.id === Object.values(prop)[0] && node.parentId === Object.keys(prop)[0]
            )
            if (selected) {
              node.selected = true
            }
            return node
          }
          )
          if (filtered.length > 0) {
            return filtered
          }
        })
        let properties = [];
        allKeysByParent.forEach((propKey) => {
          if (formData[`field_${propKey.title}`]) {
            let propKeyId = propKey.id;
            let propValue = formData[`field_${propKey.title}`].value;

            properties.push({ [propKeyId]: propValue });
          }
        });
        attrValue = properties;
        keyOfAttribute = "props"


      }

      else if (defType.defTypeTitle === 'instanceData') {

        let propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
        let datasNodes = JSON.parse(sessionStorage.getItem(`datas`))[0].nodes;
        let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].nodes;

        let props = State.clickedObj.props
        let parentId = State.clickedObj.parentId;

        let parentObj = datasNodes.find((node) => node.id === parentId);
        let parentParentObj = configNodes.filter((node) => node.id === parentObj.parentId);

        let instanceDataPropKeys = parentParentObj[0].instanceDataPropKeys;

        let allKeysByParent = propsNodesRels.filter((node) => {
          return instanceDataPropKeys.includes(node.id);
        });

        let propKeyList = allKeysByParent.filter(propKey => {
          let filtered = propsNodesRels.filter(node => node.parentId === propKey.id)
          if (filtered.length > 0) {
            return filtered
          }
        })
        let properties = [];
        allKeysByParent.forEach((propKey) => {
          if (formData[`field_${propKey.title}`]) {
            let propKeyId = propKey.id;
            let propValue = formData[`field_${propKey.title}`].value;

            properties.push({ [propKeyId]: propValue });
          }
        });
        attrValue = properties


      }


      else if (defType.defTypeTitle === 'typeData') {

        let propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
        let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].nodes;
        let props = State.clickedObj.props;

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
          filtered = filtered.filter(node => {
            let selected = props.find(prop =>
              node.id === Object.values(prop)[0] && node.parentId === Object.keys(prop)[0]
            )
            if (selected) {
              node.selected = true
            }
            return node
          }
          )
          if (filtered.length > 0) {
            return filtered
          }
        });

        let properties = [];
        allKeysByParent.forEach((propKey) => {
          if (formData[`field_${propKey.title}`]) {
            let propKeyId = propKey.id;
            let propValue = formData[`field_${propKey.title}`].value;

            properties.push({ [propKeyId]: propValue });
          }
        });
        keyOfAttribute = "props"
        attrValue = properties

      }


      else if (defType.defTypeTitle === 'configObj') {


        let propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
        let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].nodes;

        let props = State.clickedObj.props;


        let parentId = State.clickedObj.parentId;

        let parentObj = configNodes.find((node) => node.id === parentId);
        // getting title of key of attribute
        let titleOfKeyAttribute = getDefType(
          valueOfAttribute.key.defId,
          valueOfAttribute.key.defTypeId
        ).defTypeTitle;

        let allKeyIdsByParent = parentObj[`${titleOfKeyAttribute}s`];

        let allKeysByParent = propsNodesRels.filter((node) => {
          return allKeyIdsByParent.includes(node.id);
        });


        allKeysByParent.forEach((propKey) => {
          let filtered = propsNodesRels.filter(
            (node) => node.parentId === propKey.id
          );
          filtered = filtered.filter(node => {
            let selected = props.find(prop =>
              node.id === Object.values(prop)[0] && node.parentId === Object.keys(prop)[0]
            )
            if (selected) {
              node.selected = true
            }
            return node
          }
          )
          if (filtered.length > 0) {
            return filtered
          }
        });
        let properties = [];
        allKeysByParent.forEach((propKey) => {
          if (formData[`field_${propKey.title}`]) {
            let propKeyId = propKey.id;
            let propValue = formData[`field_${propKey.title}`].value;

            properties.push({ [propKeyId]: propValue });
          }
        });
        console.log(properties)
        attrValue = properties;

      }


      else if (defType.defTypeTitle === 'instanceDataExternalRel' || defType.defTypeTitle === 'instanceDataInternalRel') {

        let propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
        let datasNodes = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;
        let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let props = State.clickedObj.props
        let parentId = State.clickedObj.parentId;

        let parentObj = datasNodes.find((node) => node.id === parentId);
        let parentParentObj = configNodes.filter((node) => node.id === parentObj.parentId);

        let instanceDataPropKeys = parentParentObj[0].instanceDataRelPropKeys;

        let allKeysByParent = propsNodesRels.filter((node) => {
          return instanceDataPropKeys.includes(node.id);
        });

        let propKeyList = allKeysByParent.filter(propKey => {
          let filtered = propsNodesRels.filter(node => node.parentId === propKey.id)
          if (filtered.length > 0) {
            return filtered
          }
        })
        let properties = [];
        allKeysByParent.forEach((propKey) => {
          if (formData[`field_${propKey.title}`]) {
            let propKeyId = propKey.id;
            let propValue = formData[`field_${propKey.title}`].value;

            properties.push({ [propKeyId]: propValue });
          }
        });
        attrValue = properties;

      }


      else {

        let propsNodes = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
        let titleOfKeyAttribute = getDefType(valueOfAttribute.key.defId, valueOfAttribute.key.defTypeId).defTypeTitle;
        let allKeyIdsByParent = State.clickedObj[`${titleOfKeyAttribute}s`]
        console.log(titleOfKeyAttribute, allKeyIdsByParent)

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
  if (defId === 2) {
    defType = { defTypeTitle: State.validDefTypeRels[0] }
  }

  delete formDataObj['target']
  delete formDataObj['source']
  formDataObj['parentId'] = State.clickedObj.parentId;
  formDataObj['id'] = State.clickedObj.id

  console.log(view, defType, await formDataObj)
  await Actions.UPDATE(view, defType, await formDataObj);
};

export default formSaveEditFunction;
