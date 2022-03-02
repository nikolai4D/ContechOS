import generatePropKeysFromParentIdTypeData from './generatePropKeysFromParentIdTypeData.js';
import getPropKeysFromParentsParentIdTypeData from './getPropKeysFromParentsParentIdTypeData.js';

export default function (d3) {

    d3.selectAll(".field_configDefInternalRel").on("change", async () => {
        generatePropKeysFromParentIdTypeData('configDefInternalRel', 'rels')
    });

    d3.selectAll(".field_configObjInternalRel").on("change", async () => {
        generatePropKeysFromParentIdTypeData('configObjInternalRel', 'rels')
    });

    d3.selectAll(".field_typeDataInternalRel").on("change", async () => {
        getPropKeysFromParentsParentIdTypeData("Internal")
    });

    d3.selectAll(".field_typeDataExternalRel").on("change", async () => {
        getPropKeysFromParentsParentIdTypeData("External")
    });

    d3.selectAll(".field_configObjExternalRel").on("change", async () => {
        generatePropKeysFromParentIdTypeData('configObjExternalRel', 'rels')
    });

    d3.selectAll(".field_configDefExternalRel").on("change", async () => {
        generatePropKeysFromParentIdTypeData('configDefExternalRel', 'rels')
    });
}  