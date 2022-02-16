import Actions from "../../store/Actions.js";
import { getTypeDetails } from '../FormNode.js';
import { select } from "https://cdn.skypack.dev/d3@6";

const formNodeFunction = async (view, d, type, clickedObj) => {

    event.preventDefault();
    const formData = document.getElementById("formNode");
    let formDataObj = {}

    console.log(`${type}Types`, `${type}TypeId`)
    const typesDetail = getTypeDetails(parseInt(d.target.id), `${type}Types`, `${type}TypeId`);

    typesDetail.attributes.forEach(async attr => {

        let attrKey = Object.keys(attr)[0];

        let valueOfAttr = Object.values(attr)[0];
        if (valueOfAttr['hidden']) {
            formDataObj[attrKey] = await clickedObj;


        }
        else {

            let formAttr = formData[`field_${attrKey}`];
            console.log(attrKey, 'attrKey')
            console.log(formData, 'formData')

            console.log(formAttr, 'formAttr')
            // console.log(formAttr.value, "input", [...formAttr.selectedOptions].map(option => option.value), "mupltiple")

            let attrValue = '';
            if (formAttr.tagName === "INPUT") {  // if input
                attrValue = formAttr.value;
            }

            else if (formAttr.tagName === "SELECT") {

                if (Object.values(attr)[0]['nodeTypeId']) {  // If regular dropdown
                    attrValue = formAttr.value;

                }
                else { // if dropdown multiple
                    attrValue = await [...formAttr.selectedOptions].map(option => option.value);
                    console.log('attrValue', attrValue)
                }
            }
            formDataObj[attrKey] = await attrValue;
        }
    });
    await Actions.CREATE(view, typesDetail.title, await formDataObj);
    select(".FormMenuContainer").remove();
}

export default formNodeFunction;