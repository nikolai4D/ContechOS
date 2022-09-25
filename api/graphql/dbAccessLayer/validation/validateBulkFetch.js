const { validateId } = require("./validateId");
const { voc } = require("../voc");
const { filterItems } = require("../helpers/filterItems");

function validateBulkFetch(params
) {
    this.defType = params.defType ?? null
    this.parentId = params.parentId ?? null
    this.kindOfItem = params.kindOfItem ?? null
    this.title = params.title ?? null
    this.targetId = params.targetId ?? null
    this.sourceId = params.sourceId ?? null
    console.log("targetId: " + this.targetId)
    console.log("sourceId: " + this.sourceId)
    this.from = params.from ?? 0
    this.limit = params.limit ?? 50
    this.defTypes = getPotentialDefTypes(this.defType, this.parentId, this.kindOfItem)

    this.filterParams = {
        target: this.targetId,
        source: this.sourceId,
        parentId: this.parentId,
        title: this.title,
    }
    this.filterFunction = (item, params) => filterItems(item, params)
}

function doesDefTypeExist(defType) {
    for (let layerIndex in voc.layers) {
        if (defType.search(voc.layers[layerIndex].inString) !== -1) {
            if (layerIndex == 4) {
                let defTypeEnd = defType.substring(voc.layers[layerIndex].inString.length, defType.length)
                if (Object.values(voc.propertyTypes).find(el => el.inString === defTypeEnd)) return true
                else throw new Error("property type of the provided deftype is invalid. Deftype: " + defType)
            }
            else {
                if (voc.layers[layerIndex].inString.length === defType.length) return true
                else {
                    let defTypeEnd = defType.substring(voc.layers[layerIndex].inString.length, defType.length)
                    if (Object.values(voc.relationshipTypes).find(el => el.inString === defTypeEnd)) return true
                    else throw new Error("relationship type of the provided deftype is invalid. Deftype: " + defType)
                }
            }
        }
    }
    throw new Error("layer of the defType is invalid, defType: " + defType)
}

function getPotentialDefTypes(defType, parentId, kindOfItem) {
    let defTypes = []

    if (defType !== null && doesDefTypeExist(defType)) {
        defTypes.push(defType)
    }
    else if (parentId !== null) {
        const parentData = new validateId(parentId)
        defTypes.push(parentData.childrenDefType())
    }
    else if (kindOfItem !== null) {
        if (kindOfItem === "node") {
            for (let i = 0; i < 4; i++) defTypes.push(voc.layers[i].inString)
        }
        else if (kindOfItem === "relationship") {
            for (let i = 0; i < 4; i++) defTypes.push(
                voc.layers[i].inString + voc.relationshipTypes.exRel.inString,
                voc.layers[i].inString + voc.relationshipTypes.exRel.inString)
        }
        else if (kindOfItem === "property") defTypes.push(
            voc.layers[4].inString + voc.propertyTypes.pType.inString,
            voc.layers[4].inString + voc.propertyTypes.pValue.inString,
            voc.layers[4].inString + voc.propertyTypes.pKey.inString,

        )
        else throw new Error("invalid kind of item: " + kindOfItem)
    }
    else { //Set all directories to be looked in.
        for (let i = 0; i < 4; i++) {
            defTypes.push(
                voc.layers[i].inString,
                voc.layers[i].inString + voc.relationshipTypes.exRel.inString,
                voc.layers[i].inString + voc.relationshipTypes.exRel.inString)
        }
        defTypes.push(
            voc.layers[4].inString + voc.propertyTypes.pType.inString,
            voc.layers[4].inString + voc.propertyTypes.pValue.inString,
            voc.layers[4].inString + voc.propertyTypes.pKey.inString)
    }

    return defTypes
}



module.exports = { validateBulkFetch, doesDefTypeExist }