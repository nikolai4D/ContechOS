import dropDown from "./DropDownField.js";
import inputField from "./InputField.js";
import getDefType from "./graphFunctions/getDefType.js";
import { State } from '../../store/State.js';
import { getDefTypeFromSessionStorage } from './graphFunctions/getDefTypeFromSessionStorage.js';

export function FormEdit() {
    let fieldsArray = [];

    let { defId, defTypeTitle } = State.clickedObj
    let definitions = JSON.parse(sessionStorage.getItem('definitions'))[0]
    let def = definitions.defs.find((obj) => obj.defId === defId);


    let defType = def.defTypes.find((obj) => obj.defTypeTitle === defTypeTitle);
    defType.defId = defId;

    const { fieldTypes, fieldProperties } = definitions.fields;
    let defTypeAttributes = defType.attributes;

    for (let attribute of defTypeAttributes) {
        let displayTitle = (Object.values(attribute)[0].displayTitle) ? Object.values(attribute)[0].displayTitle : Object.keys(attribute)[0];
        let keyOfAttribute = Object.keys(attribute)[0];
        let valueOfAttribute = Object.values(attribute)[0];
        let fieldTypeId = valueOfAttribute.fieldTypeId;
        let fieldType = fieldTypes.find((obj) => obj.fieldTypeId === fieldTypeId)
            .type;

        if (defId === 2) {
        }

        if (fieldType === "input") {
            createInput(displayTitle, fieldsArray, keyOfAttribute, defType, State.clickedObj);
        } else if (fieldType === "dropDown") {
            const { defId, defTypeId } = valueOfAttribute;
            console.log(defId, defTypeId)
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
    <label class="form-label" for="field_${keyOfAttribute}">${displayTitle}</label>
    <input type="text" id="field_${keyOfAttribute}" class="form-control" name="field_${keyOfAttribute}" disabled value="Click target node"><br>
</div>`;
            fieldsArray.push(htmlString);
        }
    }

    const template = `
  <div class="formCreate position-absolute">
        <div><h5>+ ${defType.defTypeDisplayTitle.replace('Internal ', '').replace('External ', '')}</h5></div>
        <div class="card">
        <div style="display:flex;justify-content: right;/*! align-items: right; */padding-top: 0.5em;padding-right: 0.5em;">   
         <i id="penFormEditSave" class="bi bi-check-lg text-black opacity-25" style="font-size:1.75em; margin-top:-0.33em;"></i>    
         <button type="button" class="btn-close close-button" aria-label="Close"></button>
         </div>
        <div class="card-body" style="padding: 0rem 1rem 1rem 1rem;">
           <form id="formCreate" >
             ${fieldsArray.join("")}
            </form>
        </div>
        </div>
    </div>
`;
    return template;
}

const createInput = (displayTitle, fieldsArray, keyOfAttr) => {
    if (displayTitle === 'Parent') {
        let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].nodes;
        let parentId = State.clickedObj.parentId;
        let parentObj = configNodes.find((node) => node.id === parentId);
        fieldsArray.push(inputField(displayTitle, keyOfAttr, parentObj.title, 'disabled'));
    }
    else {

        fieldsArray.push(inputField(displayTitle, keyOfAttr, State.clickedObj[keyOfAttr]));
    }
};

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
    fieldsArray.push(dropDownString);
    fieldsArray.push(
        `<div id="field_filteredProps_typeData" name="field_filteredProps_typeData"></div>`
    );
};

const createDropdownMultiple = (fieldsArray, keyOfAttribute, defType, displayTitle) => {
    let allNodesByDefType = getDefTypeFromSessionStorage(defType);

    let chosenPropKeys = State.clickedObj[keyOfAttribute]

    allNodesByDefType = allNodesByDefType.map(node => {
        let selected = chosenPropKeys.find(prop => node.id === prop
        )
        if (selected) {
            node.selected = true
        }
        return node
    }
    )

    let dropDownString = dropDown(displayTitle, keyOfAttribute, allNodesByDefType, "multiple");
    fieldsArray.push(dropDownString);
};

const createDropdownKeyValue = (
    fieldsArray,
    valueOfAttribute,
    defType
) => {
    let dropDownHtmlString = "";

    let allKeyIdsByParent = [];
    let propsNodesRels = [];
    if (defType.defTypeTitle === "configObjInternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let parentConfigDefInternalRels = configRels.filter((rel) => {
            return (
                rel.source === State.clickedObj.parentId && rel.target === State.clickedObj.parentId
            );
        });

        let dropDownString = dropDown(
            "configDefInternalRel",
            "configDefInternalRel",
            parentConfigDefInternalRels
        );
        fieldsArray.push(dropDownString);
        fieldsArray.push(
            `<div id="field_filteredProps" name="field_filteredProps"></div>`
        );
    } else if (defType.defTypeTitle === "configObjExternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let parentConfigDefExternalRels = configRels.filter((rel) => {
            return (
                rel.source === State.clickedObj.parentId && rel.target !== State.clickedObj.parentId
            );
        });

        let dropDownString = dropDown(
            "configDefExternalRel",
            "configDefExternalRel",
            parentConfigDefExternalRels
        );
        fieldsArray.push(dropDownString);
        fieldsArray.push(
            `<div id="field_filteredProps" name="field_filteredProps"></div>`
        );

    } else if (defType.defTypeTitle === "typeDataInternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let parentConfigDefInternalRels = configRels.filter((rel) => {
            return (
                rel.defTypeTitle === "configObjInternalRel" &&
                (rel.source === State.clickedObj.parentId ||
                    rel.target === State.clickedObj.parentId)
            );
        });


        let dropDownString = dropDown(
            "configObjInternalRel",
            "configObjInternalRel",
            parentConfigDefInternalRels
        );
        fieldsArray.push(dropDownString);
        fieldsArray.push(
            `<div id="field_filteredProps" name="field_filteredProps"></div>`
        );
    } else if (defType.defTypeTitle === "instanceDataInternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;

        let parentConfigDefInternalRels = configRels.filter((rel) => {
            return (
                rel.defTypeTitle === "typeDataInternalRel" &&
                (rel.source === State.clickedObj.parentId ||
                    rel.target === State.clickedObj.parentId)
            );
        });

        let dropDownString = dropDown(
            "typeDataInternalRel",
            "typeDataInternalRel",
            parentConfigDefInternalRels
        );
        fieldsArray.push(dropDownString);
        fieldsArray.push(
            `<div id="field_filteredProps" name="field_filteredProps"></div>`
        );
    } else if (defType.defTypeTitle === "instanceDataExternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`datas`))[0].rels;

        let parentConfigDefExternalRels = configRels.filter((rel) => {
            return (
                rel.defTypeTitle === "typeDataExternalRel" &&
                (rel.source === State.clickedObj.parentId ||
                    rel.target === State.clickedObj.parentId)
            );
        });

        let dropDownString = dropDown(
            "typeDataExternalRel",
            "typeDataExternalRel",
            parentConfigDefExternalRels
        );
        fieldsArray.push(dropDownString);
        fieldsArray.push(
            `<div id="field_filteredProps" name="field_filteredProps"></div>`
        );
    } else if (defType.defTypeTitle === "typeDataExternalRel") {
        let configRels = JSON.parse(sessionStorage.getItem(`configs`))[0].rels;

        let parentConfigDefExternalRels = configRels.filter((rel) => {
            return (
                rel.defTypeTitle === "configObjExternalRel" &&
                (rel.source === State.clickedObj.parentId ||
                    rel.target === State.clickedObj.parentId)
            );
        });

        let dropDownString = dropDown(
            "configObjExternalRel",
            "configObjExternalRel",
            parentConfigDefExternalRels
        );
        fieldsArray.push(dropDownString);
        fieldsArray.push(
            `<div id="field_filteredProps" name="field_filteredProps"></div>`
        );

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
                    propKey.id,
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
    else if (State.clickedObj.defTypeTitle === "configObj") {
        // getting all props nodes
        propsNodesRels = JSON.parse(sessionStorage.getItem(`props`))[0].nodes;
        let configNodes = JSON.parse(sessionStorage.getItem(`configs`))[0].nodes;

        let props = State.clickedObj.props;


        let parentId = State.clickedObj.parentId;

        let parentObj = configNodes.find((node) => node.id === parentId);
        console.log(parentObj)
        // getting title of key of attribute
        let titleOfKeyAttribute = getDefType(
            valueOfAttribute.key.defId,
            valueOfAttribute.key.defTypeId
        ).defTypeTitle;

        allKeyIdsByParent = parentObj[`${titleOfKeyAttribute}s`];

        let allKeysByParent = propsNodesRels.filter((node) => {
            return allKeyIdsByParent.includes(node.id);
        });

        allKeysByParent.forEach((propKey) => {
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
                dropDownHtmlString += dropDown(
                    propKey.title,
                    propKey.title,
                    filtered,
                    null,
                    propKey.id,
                );
            }
        });
    }
    else if (State.clickedObj.defTypeTitle === "instanceData") {
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
};
