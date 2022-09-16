const {IdData} = require("./IdController");
const {Voc} = require("../Voc");
const {filterItems} = require("../helpers/filterItems");

function BulkFetchController(params
){
    this.defType = params.defType ?? null
    this.parentId = params.parentId ?? null
    this.targetId = params.targetId ?? null
    this.sourceId = params.sourceId ?? null
    this.kindOfItem = params.kindOfItem ?? null
    this.title = params.title ?? null
    this.targetId = params.target ?? null
    this.sourceId = params.source ?? null
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

function doesDefTypeExist(defType){
    for (let layerIndex in Voc.layers) {
        if(defType.search(Voc.layers[layerIndex].inString) !== -1){
            if(layerIndex == 4){
                let defTypeEnd = defType.substring(Voc.layers[layerIndex].inString.length, defType.length)
                if(Object.values(Voc.propertyTypes).find(el => el.inString === defTypeEnd))return true
                else throw new Error("property type of the provided deftype is invalid. Deftype: " + defType)
            }
            else {
                if (Voc.layers[layerIndex].inString.length === defType.length) return true
                else {
                    let defTypeEnd = defType.substring(Voc.layers[layerIndex].inString.length, defType.length)
                    if(Object.values(Voc.relationTypes).find(el => el.inString === defTypeEnd))return true
                    else throw new Error("relation type of the provided deftype is invalid. Deftype: " + defType)
                }
            }
        }
    }
    throw new Error("layer of the defType is invalid, defType: " + defType)
}

function getPotentialDefTypes(defType, parentId, kindOfItem){
        let defTypes = []
    
        if (defType !== null && doesDefTypeExist(defType)) {
            defTypes.push(defType)
        }
        else if (parentId !== null) {
            const parentData = new IdData(parentId)
            defTypes.push(parentData.childrenDefType())
        } 
        else if (kindOfItem !== null){
            if(kindOfItem === "node") {
                for (let i = 0; i<4; i++) defTypes.push( Voc.layers[i].inString )
            }
            else if(kindOfItem === "relation") {
                for (let i = 0; i<4; i++) defTypes.push(
                    Voc.layers[i].inString + Voc.relationTypes.exRel.inString,
                    Voc.layers[i].inString + Voc.relationTypes.exRel.inString )
            }
            else if (kindOfItem === "property") defTypes.push(
                Voc.layers[4].inString + Voc.propertyTypes.pType.inString,
                Voc.layers[4].inString + Voc.propertyTypes.pValue.inString,
                Voc.layers[4].inString + Voc.propertyTypes.pKey.inString,

            )
            else throw new Error("invalid kind of item: " + kindOfItem)
        }
        else { //Set all directories to be looked in.
            for (let i = 0; i<4; i++) {
                defTypes.push(
                    Voc.layers[i].inString,
                    Voc.layers[i].inString + Voc.relationTypes.exRel.inString,
                    Voc.layers[i].inString + Voc.relationTypes.exRel.inString)
            }
            defTypes.push(
                Voc.layers[4].inString + Voc.propertyTypes.pType.inString,
                Voc.layers[4].inString + Voc.propertyTypes.pValue.inString,
                Voc.layers[4].inString + Voc.propertyTypes.pKey.inString)
        }

        return defTypes
}



module.exports = {BulkFetchData: BulkFetchController, doesDefTypeExist}