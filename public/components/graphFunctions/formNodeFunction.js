import Actions from "../../store/Actions.js";
import { getTypeDetails, getNodeTypesAttrs } from "../FormNode.js";
import { select } from "https://cdn.skypack.dev/d3@6";

const formNodeFunction = async (view, d, type, clickedObj) => {
  event.preventDefault();
  const formData = document.getElementById("formNode");
  let formDataObj = {};

  const typesDetail = getTypeDetails(
    parseInt(d.target.id),
    `${type}Types`,
    `${type}TypeId`
  );

  typesDetail.attributes.forEach(async (attr) => {
    let attrKey = Object.keys(attr)[0];

    let valueOfAttr = Object.values(attr)[0];
    if (valueOfAttr["hidden"]) {
      formDataObj[attrKey] = await clickedObj.id; //source
    } else {
      let attrValue = "";
      let formAttr = formData[`field_${attrKey}`];

      if (typeof valueOfAttr === "string") {
        // Returns input forms
        attrValue = formAttr.value;
      } else if (Array.isArray(valueOfAttr)) {
        if (valueOfAttr[0]["nodeTypeId"]) {
          // Returns dropwdowns with multiple choice
          attrValue = await [...formAttr.selectedOptions].map(
            (option) => option.value
          );
        } else {
          // props with key value pair

          let allNodesByTypeKey = getNodeTypesAttrs(
            valueOfAttr[0].key["nodeTypeId"]
          );
          let allNodesByTypeValue = getNodeTypesAttrs(
            valueOfAttr[0].value["nodeTypeId"]
          );

          let propKeyList = allNodesByTypeKey.filter((propkey) => {
            let filtered = allNodesByTypeValue.filter(
              (propVal) => propVal.propKeyId === propkey.id
            );
            if (filtered.length > 0) {
              return filtered;
            }
          });

          let props = propKeyList.map((propKey) => {
            let propKeyId = propKey.id;
            let propValue = formData[`field_${propKey.title}`].value;
            return { [propKeyId]: propValue };
          });
          attrValue = props;
        }
      } else if (typeof valueOfAttr === "object") {
        // Returns single dropdown
        attrValue = formAttr.value;
      }
      formDataObj[attrKey] = await attrValue;
    }
  });
  await Actions.CREATE(view, typesDetail.title, await formDataObj);
  select(".FormMenuContainer").remove();
};

export default formNodeFunction;
