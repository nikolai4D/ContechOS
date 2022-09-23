const {IdController} = require("./IdController")
const {Voc} = require("../Voc");
const { v4} = require('uuid');

function RelCreaController(params){

        this.sourceIdData = new IdController(params.sourceId)
        this.targetIdData= new IdController(params.targetId)


        areSourceAndTargetOnTheSameLevel(this.sourceIdData, this.targetIdData)

        this.parentIdData = getParentId(params.parentId, this.sourceIdData)

        this.layer = this.sourceIdData.layer

        areSourceAndTargetOfValidTypes(this.targetIdData, this.sourceIdData, this.parentIdData, this.sourceIdData.layerIndex)

        this.relationType = getRelationType(this.sourceIdData, this.targetIdData, this.parentIdData)
        this.defType = getDefType(this.layer, this.relationType)

        this.id = getId(this.layer, this.relationType, this.sourceIdData, this.targetIdData)

        this.formattedParams = getFormattedParams(this.sourceIdData.id, this.targetIdData.id, this.parentIdData)
}

function areSourceAndTargetOnTheSameLevel(source, target){
        if(source.layerIndex === target.layerIndex) return true
        else throw "source and layer should be on the same layer."
}

function getParentId(parentId, source){
        if((parentId === null || parentId === undefined) && source.layerIndex === 0)  return null

        let parData = new IdController(parentId)
        if(parData.layerIndex !== source.layerIndex + 1) throw new Error("Cy_Rel parentId is not directly above the source layer.")
        return parData
}

function areSourceAndTargetOfValidTypes(target, source, parent, layerIndex){
        if(layerIndex === 0) {
                if(target.kindOfItem !== "node") throw new Error("target must be a node.")
                else if(source.kindOfItem !== "node") throw new Error("source must be a node.")
        }
        else if(parent.targetId() !== target.parentId()) throw new Error("Target parentId does not match parent targetId")
        else if(parent.sourceId() !== source.parentId()) throw "Source parentId does not match parent sourceId"
}

function getRelationType(source, target, parent){
        if(parent !== null) return parent.relationType
        if(source.id() === target.id()) return Voc.relationTypes.inRel
        else return Voc.relationTypes.exRel
}

function getDefType(layer, relationType){
        return layer.inString + relationType.inString
}

function getId(layer, relationType, source, target){
        return layer.abbr + relationType.abbr + "_" + v4() + "-" + source.id + "-" + target.id
}

function getFormattedParams(sourceId, targetId, parent) {
        const params = {source: sourceId, target: targetId,}
        if(parent !== null) params.parentId = parent.id
        return params
}


module.exports = { RelCreaController }