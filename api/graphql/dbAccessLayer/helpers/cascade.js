const { getItems } = require("../../dbAccessLayer/crud/read")

// ToDo: optimize. Refactor.

async function cascade(params = {},intersect = true) {

    let configDefNodes = await getAllRequiredNodesFromLayer("configDef", params.configDef)
    let configObjNodes = await getAllRequiredNodesFromLayer("configObj", params.configObj)
    let typeInstanceNodes = await getAllRequiredNodesFromLayer("typeData", params.typeData)
    let dataInstanceNodes = await getAllRequiredNodesFromLayer("instanceData", params.instanceData)
    console.log("types: " + typeInstanceNodes.length)
    let configDefExternalRels = await getRelsFromNodes(configDefNodes, "configDef", "ExternalRel")
    let configDefInternalRels = await getRelsFromNodes(configDefNodes, "configDef", "InternalRel")
    let configObjExternalRels = await getRelsFromNodes(configObjNodes, "configObj", "ExternalRel")
    let configObjInternalRels = await getRelsFromNodes(configObjNodes, "configObj", "InternalRel")
    let typeInstanceExternalRels = await getRelsFromNodes(typeInstanceNodes, "typeData", "ExternalRel")
    let typeInstanceInternalRels = await getRelsFromNodes(typeInstanceNodes, "typeData", "InternalRel")
    let dataInstanceExternalRels = await getRelsFromNodes(dataInstanceNodes, "instanceData", "ExternalRel")
    let dataInstanceInternalRels = await getRelsFromNodes(dataInstanceNodes, "instanceData", "InternalRel")

    if(intersect === true) {
        configObjNodes = IntersectLayer(configDefNodes, configObjNodes, configDefExternalRels, configObjExternalRels, configDefInternalRels, configObjInternalRels)
        typeInstanceNodes = IntersectLayer(configObjNodes, typeInstanceNodes, configObjExternalRels, typeInstanceExternalRels, configObjInternalRels, typeInstanceInternalRels)
        dataInstanceNodes = IntersectLayer(typeInstanceNodes, dataInstanceNodes, typeInstanceExternalRels, dataInstanceExternalRels, typeInstanceInternalRels, dataInstanceInternalRels)
    }

    return {configDefNodes, configObjNodes, typeInstanceNodes, dataInstanceNodes}
}

async function getAllRequiredNodesFromLayer(layerName, params = {}) {
    let array = []

    if(params.title !== undefined) for (let title of params.title) {
        array.push(...await getItems({title: title, kindOfItem: "node", defType: layerName}))
    }
    if(params.id !== undefined) for (let id of params.id) {
        let nodes = await getItems({id: id, kindOfItem: "node", defType: layerName})
        for (let node of nodes) if(!array.find(el => el.id === node.id)) array.push(node)
    }
    if(layerName === "configDef") return array
    if(params.parentId !== undefined) for (let parentId of params.parentId) {
        let nodes = await getItems({parentId: parentId, kindOfItem: "node", defType: layerName})
        for (let node of nodes) if(!array.find(el => el.id === node.id)) array.push(node)
    }
    return array
}

async function getRelsFromNodes(nodeArray, layerName, relType) {
    let array = []
    for (let node of nodeArray) {
        let rels = await getItems({targetId: node.id, kindOfItem: "relationship", defType: layerName + relType})
        if(rels )for (let rel of rels){
            if(nodeArray.find(el => el.id === rel.source)) {
                array.push(rel)
            }
        }
    }
    console.log(array.length)
    return array
}

function IntersectLayer(parentLayerNodes, childLayerNodes, parentLayerExternalRels, childLayerExternalRels, parentLayerInternalRels, childLayerInternalRels) {
    let externalIntersected = externalIntersect(parentLayerNodes, childLayerNodes, parentLayerExternalRels, childLayerExternalRels)
    let internalIntersected = internalIntersect(parentLayerNodes, childLayerNodes, parentLayerInternalRels, childLayerInternalRels, externalIntersected)
    return externalIntersected.concat(internalIntersected)
}

function externalIntersect(parentLayerNodes, childLayerNodes, parentLayerRels, childLayerRels) {
    let array = []
    for(let parentNode of parentLayerNodes){
        let parentRels = parentLayerRels.filter(rel => rel.sourceId === parentNode.id || rel.targetId === parentNode.id)
        let childNodes = childLayerNodes.filter(childNode => childNode.parentId === parentNode.id)
        for (let childNode of childNodes){
            let isValid = true
            let childRels = childLayerRels.filter(rel => rel.sourceId === childNode.id || rel.targetId === childNode.id)
            for (let parentRel of parentRels){
                if(childRels.find(el => el.parentId === parentRel.id) === undefined) {
                    isValid = false
                    break
                }
            }
            if(isValid) array.push(childNode)
        }
    }
    return array
}

function getOtherNodeFromRel(rel, node){
    if(rel.sourceId === node.id) return rel.targetId
    else return rel.sourceId
}

function internalIntersect(parentLayerNodes, childLayerNodes, parentLayerRels, childLayerRels, externalIntersected) {
    let array = []
    for(let parentNode of parentLayerNodes){
        let parentRels = parentLayerRels.filter(rel => rel.sourceId === parentNode.id || rel.targetId === parentNode.id)
        let childNodes = childLayerNodes.filter(childNode => childNode.parentId === parentNode.id)
        for (let childNode of childNodes){
            let isValid = true
            let childRels = childLayerRels.filter(rel => rel.sourceId === childNode.id || rel.targetId === childNode.id && externalIntersected.find(el => el.id === getOtherNodeFromRel(rel, childNode)) !== undefined)
            for (let parentRel of parentRels){
                if(childRels.find(el => el.parentId === parentRel.id) === undefined) {
                    isValid = false
                    break
                }
            }
            if(isValid) array.push(childNode)
        }
    }
    return array
}

module.exports = cascade