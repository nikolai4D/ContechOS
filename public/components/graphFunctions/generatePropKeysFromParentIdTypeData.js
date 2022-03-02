import getPropValForEveryPropKey from "./getPropValForEveryPropKey.js";

export default function (defType, type) {

    console.log(defType, type)
    const parentId = document.getElementById(`field_parentId_${defType}`).value;
    let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0][type];
    let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;

    let parentConfigObject = configNodes.find(node => { return node.id === parentId })

    let dropDownHtmlString = getPropValForEveryPropKey(getPropsForParentId, parentConfigObject)

    document.getElementById(`field_filteredProps_${defType}`).innerHTML = ""
    document.getElementById(`field_filteredProps_${defType}`).innerHTML = dropDownHtmlString;

}  