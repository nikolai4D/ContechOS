import Actions from "../../store/Actions.js";
import getDefType from "./getDefType.js";
import { getFieldProperties } from "../FormCreate.js";

import { select } from "https://cdn.skypack.dev/d3@6";
let definitions = "";

const formCreateFunction = async (view, d, type, clickedObj) => {
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

  for (let attribute of defTypeAttributes) {
    //   // for attribute in attributes,  get the key and the value. If the value is "hidden", skip it all together.
    let attrValue = "";

    let keyOfAttribute = Object.keys(attribute)[0];
    let valueOfAttribute = Object.values(attribute)[0];
    let fieldTypeId = valueOfAttribute.fieldTypeId;
    let fieldType = fieldTypes.find(obj => obj.fieldTypeId === fieldTypeId).type;

    let fieldPropertiesOfAttribute = getFieldProperties(valueOfAttribute, fieldProperties)
    if (fieldPropertiesOfAttribute.some(obj => obj.type === 'hidden')) {
      formDataObj[keyOfAttribute] = clickedObj.id; //source, parentId
    }
    else {
      let formAttr = formData[`field_${keyOfAttribute}`];

      if (fieldType === 'input' || fieldType === 'dropDown') {
        attrValue = formAttr.value;
      }
      else if (fieldType === 'dropDownMultiple') {
        attrValue = await [...formAttr.selectedOptions].map(
          (option) => option.value
        )
      }
      else if (fieldType === 'dropDownKeyValue') {
        let allNodesByDefTypeKey = getDefTypeFromSessionStorage(valueOfAttribute.key);
        let allNodesByDefTypeValue = getDefTypeFromSessionStorage(valueOfAttribute.value);

        let propKeyList = allNodesByDefTypeKey.filter((propkey) => {
          let filtered = allNodesByDefTypeValue.filter(
            (propVal) => propVal.propKeyId === propkey.id
          );
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
      else if (fieldType === 'externalNodeClick') { }

      formDataObj[keyOfAttribute] = attrValue;

    }

  }
  console.log(formDataObj)


  await Actions.CREATE(view, defType.title, await formDataObj);
  select(".FormMenuContainer").remove();
};

export default formCreateFunction;



// typesDetail.attributes.forEach(async (attr) => {
//   let keyOfAttribute = Object.keys(attr)[0];

//   let valueOfAttr = Object.values(attr)[0];
//   if (valueOfAttr["hidden"]) {
//     formDataObj[keyOfAttribute] = await clickedObj.id; //source
//   } else {
//     let attrValue = "";
//     let formAttr = formData[`field_${keyOfAttribute}`];

//     if (typeof valueOfAttr === "string") {
//       // Returns input forms
//       attrValue = formAttr.value;
//     } else if (Array.isArray(valueOfAttr)) {
//       if (valueOfAttr[0]["nodeTypeId"]) {
//         // Returns dropwdowns with multiple choice
//         attrValue = await [...formAttr.selectedOptions].map(
//           (option) => option.value
//         );
//       } else {
//         // props with key value pair



//         let allNodesByTypeKey = getDefTypesAttrs(
//           valueOfAttr[0].key["nodeTypeId"]
//         );
//         let allNodesByTypeValue = getDefTypesAttrs(
//           valueOfAttr[0].value["nodeTypeId"]
//         );

//         let propKeyList = allNodesByTypeKey.filter((propkey) => {
//           let filtered = allNodesByTypeValue.filter(
//             (propVal) => propVal.propKeyId === propkey.id
//           );
//           if (filtered.length > 0) {
//             return filtered;
//           }
//         });

//         let props = propKeyList.map((propKey) => {
//           let propKeyId = propKey.id;
//           let propValue = formData[`field_${propKey.title}`].value;
//           return { [propKeyId]: propValue };
//         });
//         attrValue = props;
//       }
//     } else if (typeof valueOfAttr === "object") {
//       // Returns single dropdown
//       attrValue = formAttr.value;
//     }