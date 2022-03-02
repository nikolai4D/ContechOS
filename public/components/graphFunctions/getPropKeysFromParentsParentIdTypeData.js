import getPropValForEveryPropKey from "./getPropValForEveryPropKey.js";

export default function (defType) {
    console.log(defType)
    const propsParentId = document.getElementById(`field_typeData${defType}Rel`).value;

    let datasRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;
    let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
    let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
    let parentDatasRels = datasRels.find(rel => { return rel.id === propsParentId }).parentId

    let getParentsParent = configRels.find(node => node.id === parentDatasRels)

    console.log()

    dropDownHtmlString = getPropValForEveryPropKey(getPropsForParentId, getParentsParent)

    document.getElementById('field_filteredProps').innerHTML = ""
    document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
}  