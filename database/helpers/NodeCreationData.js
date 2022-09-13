import {IdData} from "./idData";
import {Voc} from "../Voc";

function NodeCreationData(parentId = null){
    this.parentIdData = getParentIdData(parentId)
    this.layerIndex = getLayerIndex()
    this.defType = Voc.layers[this.layerIndex].toString
}

function getParentIdData(parentId){
    if(parentId === null || parentId === undefined) return null
    let parentData = new IdData(parentId)

    if(parentId.kindOfItem !== "node") throw("Node creation interrupted: parent must be a node")
    else return parentData
}

function getLayerIndex(parent){
    if(parent === null) return 0
    else return parent.layerIndex +1
}

function getDefType(layerIndex){
    return
}

function getId(){

}

module.exports = { NodeCreationData }