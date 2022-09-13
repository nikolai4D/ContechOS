const {IdData} = require("./idData")
const {Voc} = require("../Voc");
const { v4} = require('uuid');

function RelationCreationData(sourceId, targetId, parentId = null){
        this.sourceIdData = new IdData(sourceId),
        this.targetIdData= new IdData(targetId)

        areSourceAndTargetOnTheSameLevel(this.sourceIdData, this.targetIdData)

        this.parentIdData = getParentId(parentId)
        this.layer = this.sourceIdData.layer

        areSourceAndTargetOfValidTypes(this.targetIdData, this.sourceIdData, this.parentIdData)

        this.relationType = getRelationType(this.sourceIdData, this.targetIdData)
        this.defType = getDefType(this.layer, this.relationType)

        this.id = getId(this.layer, this.relationType, this.sourceIdData, this.targetIdData)
        this.formattedParams = ()=> getFormattedParams(this.sourceIdData.id, this.targetIdData.id, this.parentIdData.id)
}

function areSourceAndTargetOnTheSameLevel(source, target){
        if(source.layerIndex === target.layerIndex) return true
        else throw "source and layer should be on the same layer."
}

function getParentId(parentId, source){
        if(parentId === null && source.layerIndex === 0) return null
        let parData = new IdData(parentId)
        if(parData.layerIndex !== source.layerIndex + 1) throw "Relation parentId is not directly above the source layer."
        return new IdData(parentId)
}

function areSourceAndTargetOfValidTypes(target, source, parent, layerIndex){
        if(layerIndex === 0) {
                if(target.kindOfItem !== "node") throw "target must be a node."
                else if(source.kindOfItem !== "node") throw "source must be a node."
        }
        else if(parent.targetId() !== target.parentId()) throw "Target parentId does not match parent targetId"
        else if(parent.sourceId() !== source.parentId()) throw "Source parentId does not match parent sourceId"
}

function getRelationType(source, target){
        if(source.parentId() === target.parentId()) return Voc.relationTypes.inRel
        else return Voc.relationTypes.exRel
}

function getDefType(layer, relationType){
        return layer.inString + relationType.inString
}

function getId(layer, relationType, source, target){
        return layer.abbr + relationType.abbr + "_" + V4() + "-" + source.id + "-" + target.id
}

function getFormattedParams(sourceId, targetId, parentId) {
        const params = {source: sourceId, target: targetId,}
        if(parentId !== null) params.parentId = parentId
        return params
}


module.exports = { RelationCreationData }