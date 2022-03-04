import { State } from '../../store/State.js';
import dropDown from '../DropDownField.js';

import generatePropKeysFromParentIdTypeData from './generatePropKeysFromParentIdTypeData.js';
import getPropKeysFromParentsParentIdTypeData from './getPropKeysFromParentsParentIdTypeData.js';

export default function (d3) {

    d3.selectAll(".field_configDefInternalRel").on("change", async () => {
        console.log('hello')
        const propsParentId = document.getElementById("field_configDefInternalRel").value;
        let dropDownHtmlString = ''
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
        let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


        let parentConfigDefInternalRels = configRels.find(rel => { return rel.id === propsParentId })


        parentConfigDefInternalRels.propKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
            if (filtered.length > 0) {
                propKeys.push({ "title": propKeyObj.title, "id": propKey })
                dropDownHtmlString += dropDown(propKeyObj.title, propKeyObj.title, filtered, null, propKey.id);
            }
        })

        document.getElementById('field_filteredProps').innerHTML = ""
        document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString

    });

    d3.selectAll(".field_configDefExternalRel").on("change", async () => {

        const propsParentId = document.getElementById("field_configDefExternalRel").value;
        let dropDownHtmlString = ''
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
        let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


        let parentConfigDefExternalRels = configRels.find(rel => { return rel.id === propsParentId })


        parentConfigDefExternalRels.propKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
            if (filtered.length > 0) {
                State.propKeys.push({ "title": propKeyObj.title, "id": propKey })
                dropDownHtmlString += dropDown(propKeyObj.title, propKeyObj.title, filtered, null, propKey.id);
            }
        })

        document.getElementById('field_filteredProps').innerHTML = ""
        document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
    });

    d3.selectAll(".field_configObjInternalRel").on("change", async () => {
        console.log('hello')
        const propsParentId = document.getElementById("field_configObjInternalRel").value;
        let dropDownHtmlString = ''
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
        let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


        let parentConfigDefInternalRels = configRels.find(rel => { return rel.id === propsParentId })

        parentConfigDefInternalRels.typeDataRelPropKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })
            if (filtered.length > 0) {
                State.propKeys.push({ "title": propKeyObj.title, "id": propKey })
                dropDownHtmlString += dropDown(propKeyObj.title, propKeyObj.title, filtered, null, propKey.id);
            }
        })

        document.getElementById('field_filteredProps').innerHTML = ""
        document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
    });

    d3.selectAll(".field_configObjExternalRel").on("change", async () => {
        const propsParentId = document.getElementById("field_configObjExternalRel").value;

        let dropDownHtmlString = ''
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;
        let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


        let parentConfigObjExternalRels = configRels.find(rel => { return rel.id === propsParentId })

        parentConfigObjExternalRels.typeDataRelPropKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })

            if (filtered.length > 0) {
                State.propKeys.push({ "title": propKeyObj.title, "id": propKey })
                dropDownHtmlString += dropDown(propKeyObj.title, propKeyObj.title, filtered, null, propKey.id);
            }
        })

        document.getElementById('field_filteredProps').innerHTML = ""
        document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
    });

    d3.selectAll(".field_typeDataInternalRel").on("change", async () => {
        const propsParentId = document.getElementById("field_typeDataInternalRel").value;

        let dropDownHtmlString = ''
        let datasRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


        let parentDatasRels = datasRels.find(rel => { return rel.id === propsParentId }).parentId

        let getParentsParent = configRels.find(node => node.id === parentDatasRels)



        getParentsParent.instanceDataRelPropKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })

            if (filtered.length > 0) {
                State.propKeys.push({ "title": propKeyObj.title, "id": propKey })
                dropDownHtmlString += dropDown(propKeyObj.title, propKeyObj.title, filtered, null, propKey.id);
            }
        })
        document.getElementById('field_filteredProps').innerHTML = ""
        document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
    });

    d3.selectAll(".field_typeDataExternalRel").on("change", async () => {
        console.log('hello')

        const propsParentId = document.getElementById("field_typeDataExternalRel").value;

        let dropDownHtmlString = ''
        let datasRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let getPropsForParentId = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;


        let parentDatasRels = datasRels.find(rel => { return rel.id === propsParentId }).parentId

        let getParentsParent = configRels.find(node => node.id === parentDatasRels)

        getParentsParent.instanceDataRelPropKeys.forEach(propKey => {
            let filtered = getPropsForParentId.filter(node => node.parentId === propKey)

            let propKeyObj = getPropsForParentId.find(node => { return node.id === propKey })

            if (filtered.length > 0) {
                State.propKeys.push({ "title": propKeyObj.title, "id": propKey })
                dropDownHtmlString += dropDown(propKeyObj.title, propKeyObj.title, filtered, null, propKey.id);
            }
        })

        document.getElementById('field_filteredProps').innerHTML = ""
        document.getElementById('field_filteredProps').innerHTML = dropDownHtmlString
    });


}