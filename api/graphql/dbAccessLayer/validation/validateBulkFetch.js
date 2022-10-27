const { validateId } = require("./validateId");
const { voc } = require("../voc");
const { filterItems } = require("../helpers/filterFunction");
const variableToArray = require("../helpers/variableToArray");

function validateBulkFetch(params
) {
    this.defType = variableToArray(params.defType) ?? null
    this.parentId = variableToArray(params.parentId) ?? null
    this.kindOfItem = variableToArray(params.kindOfItem) ?? null
    this.title = variableToArray(params.title) ?? null
    this.targetId = variableToArray(params.targetId) ?? null
    this.sourceId = variableToArray(params.sourceId) ?? null
    this.from = params.from ?? 0
    this.limit = params.limit ?? 50
    this.defTypes = getPotentialDefTypes(this.defType, this.parentId, this.sourceId, this.targetId, this.kindOfItem)

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

function getPotentialDefTypes(defTypes, parentIds, sourceIds, targetIds, kindOfItems) {
    let potentialDefTypes = []

    if (defTypes !== null) {
        console.log("det", defTypes)
        for(let defType of defTypes){
            if(doesDefTypeExist(defType)) {
                potentialDefTypes.push(defType)
            }
        }
    }
    else if (parentIds !== null) {
        console.log("pid")
        for (let parentId of parentIds) {
            const parentData = new validateId(parentId)

            potentialDefTypes.push(parentData.childrenDefType())
        }
    }
    else if(sourceIds !== null) {
        for (let sourceId of sourceIds) {
            const sourceData = new validateId(sourceId)
            potentialDefTypes.push(
                voc.layers[sourceData.layerIndex].inString + voc.relationshipTypes.exRel.inString,
                voc.layers[sourceData.layerIndex].inString + voc.relationshipTypes.inRel.inString
            )

        }
    }
    else if(targetIds !== null) {
        for (let targetId of targetIds) {
            const targetData = new validateId(targetId)
            potentialDefTypes.push(
                voc.layers[targetData.layerIndex].inString + voc.relationshipTypes.exRel.inString,
                voc.layers[targetData.layerIndex].inString + voc.relationshipTypes.inRel.inString
            )

        }
    }
    else if (kindOfItems !== null) {
        console.log("koi", kindOfItems)
        for (let kindOfItem of kindOfItems) {
            if (kindOfItem === "node") {
                for (let i = 0; i < 4; i++) potentialDefTypes.push(voc.layers[i].inString)
            } else if (kindOfItem === "relationship") {
                for (let i = 0; i < 4; i++) potentialDefTypes.push(
                    voc.layers[i].inString + voc.relationshipTypes.exRel.inString,
                    voc.layers[i].inString + voc.relationshipTypes.inRel.inString)
            } else if (kindOfItem === "property") potentialDefTypes.push(
                voc.layers[4].inString + voc.propertyTypes.pType.inString,
                voc.layers[4].inString + voc.propertyTypes.pValue.inString,
                voc.layers[4].inString + voc.propertyTypes.pKey.inString,
            )
            else throw new Error("invalid kind of item: " + kindOfItem)
        }
    }
    else { //Set all directories to be looked in.
        for (let i = 0; i < 4; i++) {
            potentialDefTypes.push(
                voc.layers[i].inString,
                voc.layers[i].inString + voc.relationshipTypes.exRel.inString,
                voc.layers[i].inString + voc.relationshipTypes.inRel.inString)
        }
        potentialDefTypes.push(
            voc.layers[4].inString + voc.propertyTypes.pType.inString,
            voc.layers[4].inString + voc.propertyTypes.pValue.inString,
            voc.layers[4].inString + voc.propertyTypes.pKey.inString)
    }

    console.log(JSON.stringify("pdt: " + potentialDefTypes, null, 2))
    return potentialDefTypes
}



module.exports = { validateBulkFetch, doesDefTypeExist }