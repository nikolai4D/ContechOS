import { State } from '../../../store/State.js';
import getFieldProperties from '../graphFunctions/getFieldProperties.js';
import dropDown from "../DropDownField.js";
import { getDefTypeFromSessionStorage } from '../graphFunctions/getDefTypeFromSessionStorage.js';
import getDefType from "../graphFunctions/getDefType.js";

export function ReactiveFormCreate() {
    let fieldsArray = [];
    let defType = State.definitions.defs[1].defTypes.find(obj => State.validDefTypeRels.includes(obj.defTypeTitle))

    if (defType === undefined) {
        document.getElementsByClassName("formCreateSubmit")[0].classList.add("disabled");
        document.getElementById("field_props").innerHTML = 'No relationship available.'
        return
    }
    const { fieldTypes, fieldProperties } = State.definitions.fields;
    let defTypeAttributes = defType.attributes;

    for (let attribute of defTypeAttributes) {
        let displayTitle = (Object.values(attribute)[0].displayTitle) ? Object.values(attribute)[0].displayTitle : Object.keys(attribute)[0];
        let keyOfAttribute = Object.keys(attribute)[0];
        let valueOfAttribute = Object.values(attribute)[0];
        let fieldTypeId = valueOfAttribute.fieldTypeId;
        let fieldType = fieldTypes.find((obj) => obj.fieldTypeId === fieldTypeId)
            .type;


        let fieldPropertiesOfAttribute = getFieldProperties(
            valueOfAttribute,
            fieldProperties
        );

        if (fieldPropertiesOfAttribute.some((obj) => obj.type === "hidden")) {
            continue;
        }

        if (!fieldPropertiesOfAttribute.some((obj) => obj.type === "dependant")) {
            continue;
        }

        if (fieldType === "input") {
            createInput(displayTitle, fieldsArray, keyOfAttribute, defType, State.clickedObj);
        } else if (fieldType === "dropDown") {
            const { defId, defTypeId } = valueOfAttribute;
            createDropdown(fieldsArray, keyOfAttribute, getDefType(defId, defTypeId), displayTitle);
        } else if (fieldType === "dropDownMultiple") {
            const { defId, defTypeId } = valueOfAttribute;
            createDropdownMultiple(
                fieldsArray,
                keyOfAttribute,
                getDefType(defId, defTypeId),
                displayTitle

            );
        } else if (fieldType === "dropDownKeyValue") {
            createDropdownKeyValue(
                fieldsArray,
                valueOfAttribute,
                State.clickedObj,
                defType
            );
        } else if (fieldType === "externalNodeClick") {
            let htmlString = `<div style="display: flex; padding: 0.5em">
    <label class="form-label" for="field_${keyOfAttribute}">${keyOfAttribute}:</label>
    <input type="text" id="field_${keyOfAttribute}" class="form-control" name="field_${keyOfAttribute}" disabled value="Click target node"><br>
</div>`;
            fieldsArray.push(htmlString);
        }
    }

    const template = `
  <div class="formCreate position-absolute">
        <div><h5>+ ${defType.defTypeDisplayTitle}</h5></div>
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

// const createInput = (fieldsArray, keyOfAttr, defType) => {
//     document.getElementById(`field_`)=inputField(keyOfAttr));
// };

const createDropdown = (fieldsArray, keyOfAttribute, defType, displayTitle) => {
    let allNodesByDefType = getDefTypeFromSessionStorage(defType);

    let dropDownString = "";
    if (defType.defTypeTitle === "configObj") {
        dropDownString = dropDown(
            displayTitle,
            keyOfAttribute,
            allNodesByDefType,
            null,
            `${keyOfAttribute}_typeData`,
            "_typeData"
        );
    } else {
        dropDownString = dropDown(displayTitle, keyOfAttribute, allNodesByDefType);
    }
    // fieldsArray.push(dropDownString);
    // fieldsArray.push(

    //     `<div id="field_filteredProps_typeData" name="field_filteredProps_typeData"></div>`
    // );
    document.getElementById(`field_${keyOfAttribute}`).innerHTML = dropDownString + `<div id="field_filteredProps_typeData" name="field_filteredProps_typeData"></div>`
};

const createDropdownMultiple = (fieldsArray, keyOfAttribute, defType, displayTitle) => {
    let allNodesByDefType = getDefTypeFromSessionStorage(defType);
    let dropDownString = dropDown(displayTitle, keyOfAttribute, allNodesByDefType, "multiple");
    // fieldsArray.push(dropDownString);
    document.getElementById(`field_${keyOfAttribute}`).innerHTML = dropDownString
};

const createDropdownKeyValue = (
    fieldsArray,
    valueOfAttribute,
    defType
) => {
    let dropDownHtmlString = "";
    let allKeyIdsByParent = [];
    let propsNodesRels = [];
    if (State.validDefTypeRels[0] === "configObjInternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let parentConfigDefInternalRels = configRels.filter((rel) => {
            return (
                rel.source === State.clickedObj.parentId && rel.target === State.clickedObj.parentId
            );
        });

        let dropDownString = dropDown(
            "Definition Internal Link",
            "configDefInternalRel",
            parentConfigDefInternalRels
        );
        // fieldsArray.push(dropDownString);
        // fieldsArray.push(
        //     `<div id="field_filteredProps" name="field_filteredProps"></div>`
        // );


        document.getElementById(`field_props`).innerHTML = dropDownString + `<div id="field_filteredProps" name="field_filteredProps"></div>`

    } else if (State.validDefTypeRels[0] === "configObjExternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let parentConfigDefExternalRels = configRels.filter((rel) => {
            console.log(rel)
            return (

                (rel.source === State.clickedObj.parentId && (rel.target === State.targetObject.parentId))
            );
        });

        let dropDownString = dropDown(
            "Definition External Link",
            "configDefExternalRel",
            parentConfigDefExternalRels
        );
        // fieldsArray.push(dropDownString);
        // fieldsArray.push(
        //     `<div id="field_filteredProps" name="field_filteredProps"></div>`
        // );

        document.getElementById(`field_props`).innerHTML = dropDownString + `<div id="field_filteredProps" name="field_filteredProps"></div>`

    } else if (State.validDefTypeRels[0] === "typeDataInternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let parentConfigDefInternalRels = configRels.filter((rel) => {
            return (
                rel.defTypeTitle === "configObjInternalRel" &&
                (rel.source === State.clickedObj.parentId && (rel.target === State.targetObject.parentId))
            );
        });


        let dropDownString = dropDown(
            "Object Internal Link",
            "configObjInternalRel",
            parentConfigDefInternalRels
        );

        document.getElementById(`field_props`).innerHTML = dropDownString + `<div id="field_filteredProps" name="field_filteredProps"></div>`
        // fieldsArray.push(dropDownString);
        // fieldsArray.push(
        //     `<div id="field_filteredProps" name="field_filteredProps"></div>`
        // );
    } else if (State.validDefTypeRels[0] === "instanceDataInternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;

        let parentConfigDefInternalRels = configRels.filter((rel) => {
            return (
                rel.defTypeTitle === "typeDataInternalRel" &&
                (rel.source === State.clickedObj.parentId && (rel.target === State.targetObject.parentId))
            );
        });

        let dropDownString = dropDown(
            "Type Internal Link",
            "typeDataInternalRel",
            parentConfigDefInternalRels
        );
        // fieldsArray.push(dropDownString);
        // fieldsArray.push(
        //     `<div id="field_filteredProps" name="field_filteredProps"></div>`
        // );

        document.getElementById(`field_props`).innerHTML = dropDownString + `<div id="field_filteredProps" name="field_filteredProps"></div>`


    } else if (State.validDefTypeRels[0] === "instanceDataExternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;

        let parentConfigDefExternalRels = configRels.filter((rel) => {
            return (
                rel.defTypeTitle === "typeDataExternalRel" &&
                (rel.source === State.clickedObj.parentId && (rel.target === State.targetObject.parentId))
            );
        });

        let dropDownString = dropDown(
            "Type External Link",
            "typeDataExternalRel",
            parentConfigDefExternalRels
        );
        // fieldsArray.push(dropDownString);
        // fieldsArray.push(
        //     `<div id="field_filteredProps" name="field_filteredProps"></div>`
        // );

        document.getElementById(`field_props`).innerHTML = dropDownString + `<div id="field_filteredProps" name="field_filteredProps"></div>`

    } else if (State.validDefTypeRels[0] === "typeDataExternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let parentConfigDefExternalRels = configRels.filter((rel) => {
            return (
                rel.defTypeTitle === "configObjExternalRel" &&
                (rel.source === State.clickedObj.parentId && (rel.target === State.targetObject.parentId))
            );
        });

        let dropDownString = dropDown(
            "Object External Link",
            "configObjExternalRel",
            parentConfigDefExternalRels
        );
        // fieldsArray.push(dropDownString);
        // fieldsArray.push(
        //     `<div id="field_filteredProps" name="field_filteredProps"></div>`
        // );

        document.getElementById(`field_props`).innerHTML = dropDownString + `<div id="field_filteredProps" name="field_filteredProps"></div>`


    } else if (State.clickedObj.defTypeTitle === "configDef") {
        propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;

        let titleOfKeyAttribute = getDefType(
            valueOfAttribute.key.defId,
            valueOfAttribute.key.defTypeId
        ).defTypeTitle;
        allKeyIdsByParent = State.clickedObj[`${titleOfKeyAttribute}s`];

        let allKeysByParent = propsNodesRels.filter((node) => {
            return allKeyIdsByParent.includes(node.id);
        });

        allKeysByParent.forEach((propKey) => {
            let filtered = propsNodesRels.filter(
                (node) => node.parentId === propKey.id
            );
            if (filtered.length > 0) {
                dropDownHtmlString += dropDown(
                    propKey.title,
                    propKey.title,
                    filtered,
                    null,
                    propKey.id
                );
            }
        });
    } else if (State.clickedObj.defTypeTitle === "typeData") {
        propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
        let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].nodes;

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
            if (filtered.length > 0) {
                dropDownHtmlString += dropDown(
                    propKey.title,
                    propKey.title,
                    filtered,
                    null,
                    propKey.id
                );
            }
        });
    }
    fieldsArray.push(dropDownHtmlString);

    // document.getElementById(`field_configObjExternalRel`).innerHTML = dropDownString + `<div id="field_filteredProps" name="field_filteredProps"></div>`


};
