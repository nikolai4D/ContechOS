import Actions from "../../../store/Actions.js";
import getDefType from "./getDefType.js";
import getFieldProperties from './getFieldProperties.js';
import { State } from '../../../store/State.js';

import { select } from "https://cdn.skypack.dev/d3@6";
let definitions = "";

const formCreateFunction = async (view, d, type, clickedObj, propKeys) => {
  event.preventDefault();
  const formData = document.getElementById("formEdit");


  definitions = JSON.parse(sessionStorage.getItem("definitions"))[0];

  let { defId, defTypeTitle } = State.clickedObj

  let defNode = definitions.defs.find((obj) => obj.def === "node");
  let defRel = definitions.defs.find((obj) => obj.def === "rel");

  let defTypeNode = defNode.defTypes.find((obj) => obj.defTypeTitle === defTypeTitle);
  let defTypeRel = defRel.defTypes.find((obj) => obj.defTypeTitle === defTypeTitle);

  let defType = defTypeNode ? defTypeNode : defTypeRel;
  let def = defType.abbr.slice(-1) === 'r' ? "rel" : "node"


  // const defId = parseInt(d.target.attributes.getNamedItem("data-defid").value);
  // const defTypeId = parseInt(
  //   d.target.attributes.getNamedItem("data-deftypeid").value
  // );
  // let defType = getDefType(defId, defTypeId);
  const { fieldTypes, fieldProperties } = definitions.fields;

  let defTypeAttributes = defType.attributes;
  let formDataObj = {};




  // const { fieldTypes, fieldProperties } = definitions.fields;
  // let defTypeAttributes = defType.attributes;




  if (defId === 1) {
    State.validDefTypeRels = null
  }
  else {
    defId === 2
  }

  for (let attribute of defTypeAttributes) {
    //   // for attribute in attributes,  get the key and the value. If the value is "hidden", skip it all together.
    let attrValue = "";

    let keyOfAttribute = Object.keys(attribute)[0];
    let valueOfAttribute = Object.values(attribute)[0];
    let fieldTypeId = valueOfAttribute.fieldTypeId;
    let fieldType = fieldTypes.find(obj => obj.fieldTypeId === fieldTypeId).type;

    let fieldPropertiesOfAttribute = getFieldProperties(valueOfAttribute, fieldProperties)
    if (fieldPropertiesOfAttribute.some(obj => obj.type === 'hidden') && defId === 2) {

      if (State.validDefTypeRels[0] === 'configObjInternalRel' && keyOfAttribute === 'parentId') {

        formDataObj['parentId'] = formData[`field_configDefInternalRel`].value;
      }
      else if (State.validDefTypeRels[0] === 'configObjExternalRel' && keyOfAttribute === 'parentId') {
        formDataObj['parentId'] = formData[`field_configDefExternalRel`].value;

      }
      else if (State.validDefTypeRels[0] === 'typeDataInternalRel' && keyOfAttribute === 'parentId') {
        formDataObj['parentId'] = formData[`field_configObjInternalRel`].value;

      }
      else if (State.validDefTypeRels[0] === 'typeDataExternalRel' && keyOfAttribute === 'parentId') {
        formDataObj['parentId'] = formData[`field_configObjExternalRel`].value;

      }
      else if (State.validDefTypeRels[0] === 'instanceDataInternalRel' && keyOfAttribute === 'parentId') {
        formDataObj['parentId'] = formData[`field_typeDataInternalRel`].value;

      }

      else if (State.validDefTypeRels[0] === 'instanceDataExternalRel' && keyOfAttribute === 'parentId') {
        formDataObj['parentId'] = formData[`field_typeDataExternalRel`].value;

      }

      else {
        formDataObj[keyOfAttribute] = clickedObj.id; //source, parentId

      }
    }
    else {
      if (keyOfAttribute === 'parentId' && defType.defTypeTitle === 'typeData') {
        formDataObj['parentId'] = formData[`field_parentId_typeData`].value;

      }
      else if (keyOfAttribute === 'parentId' || keyOfAttribute === 'source') {
        formDataObj['parentId'] = clickedObj.id;
      }
      else {
        let formAttr = formData[`field_${keyOfAttribute}`];

        if (keyOfAttribute === 'target') {
          attrValue = formAttr.getAttribute('data-id');

        }

        else if (fieldType === 'input' || fieldType === 'dropDown' || fieldType === 'externalNodeClick') {
          attrValue = formAttr.value;
        }
        else if (fieldType === 'dropDownMultiple') {
          attrValue = await [...formAttr.selectedOptions].map(
            (option) => option.value
          )
        }
        else if (fieldType === 'dropDownKeyValue') {
          if (State.validDefTypeRels !== null) {
            if (State.validDefTypeRels[0] === 'configObjInternalRel' || State.validDefTypeRels[0] === 'configObjExternalRel' || defType.defTypeTitle === 'typeData' || State.validDefTypeRels[0] === 'typeDataInternalRel' || State.validDefTypeRels[0] === 'typeDataExternalRel' || State.validDefTypeRels[0] === 'instanceDataInternalRel' || State.validDefTypeRels[0] === 'instanceDataExternalRel') {

              let props = propKeys.map(propKey => {
                let theKey = propKey.id;
                let theValue = formData[`field_${propKey.title}`].value;
                return { [theKey]: theValue }
              })
              keyOfAttribute = "props"
              attrValue = props
            }


          }


          else if (defType.defTypeTitle === 'typeData') {

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
            let properties = propKeyList.filter((propKey) => {
              let propKeyId = propKey.id;
              let propValue = formData[`field_${propKey.title}`].value;
              return { [propKeyId]: propValue };
            });
            attrValue = properties;

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

            let properties = allKeysByParent.filter((propKey) => {
              let propKeyId = propKey.id;
              console.log(propKey)
              if (formData[`field_${propKey.title}`]) {
                let propValue = formData[`field_${propKey.title}`].value;
                return { [propKeyId]: propValue };
              }
            });
            attrValue = properties;



            // let propsNodes = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
            // let titleOfKeyAttribute = getDefType(valueOfAttribute.key.defId, valueOfAttribute.key.defTypeId).defTypeTitle;
            // let allKeyIdsByParent = State.clickedObj[`${titleOfKeyAttribute}s`]
            // console.log(titleOfKeyAttribute, allKeyIdsByParent)

            // let allKeysByParent = propsNodes.filter(node => { return allKeyIdsByParent.includes(node.id) })

            // let propKeyList = allKeysByParent.filter(propKey => {
            //   let filtered = propsNodes.filter(node => node.parentId === propKey.id)
            //   if (filtered.length > 0) {
            //     return filtered;
            //   }
            // })

            // let props = propKeyList.map((propKey) => {
            //   let propKeyId = propKey.id;
            //   let propValue = formData[`field_${propKey.title}`].value;
            //   return { [propKeyId]: propValue };
            // });
            // attrValue = props;

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
    }
  }
  if (defId === 2) {
    defType = { defTypeTitle: State.validDefTypeRels[0] }
  }

  console.log(view, defType, await formDataObj)
  // await Actions.CREATE(view, defType, await formDataObj);
  // select(".FormMenuContainer").remove();
};

export default formCreateFunction;
