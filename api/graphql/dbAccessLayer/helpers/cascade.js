const { getItems } = require("../../dbAccessLayer/crud/read")

// ToDo: optimize. Refactor.

async function cascade(params = {}) {

    let configDefNodes = await getAllRequiredNodesFromLayer("configDef", params.configDef)
    let configObjNodes = await getAllRequiredNodesFromLayer("configObj", params.configObj)
    let typeDataNodes = await getAllRequiredNodesFromLayer("typeData", params.typeData)
    let instanceDataNodes = await getAllRequiredNodesFromLayer("instanceData", params.instanceData)

    if(!(params.hasOwnProperty('intersect: ') && params.intersect === false)) {
        typeDataNodes = await intersect(configObjNodes, typeDataNodes, "configObj", "typeData")
        instanceDataNodes = await intersect(typeDataNodes, instanceDataNodes, "typeData", "instanceData")
    }

    return {configDefNodes, configObjNodes, typeDataNodes, instanceDataNodes}
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

async function getRelsOfNode(nodeId, nodesInLayer, layerName) {

    let targetExtRels = await getItems({targetId: nodeId, kindOfItem: "relationship", defType: layerName + "ExternalRel"})
    let sourceExtRels = await getItems({sourceId: nodeId, kindOfItem: "relationship", defType: layerName + "ExternalRel"})

    let targetIntRels = await getItems({targetId: nodeId, kindOfItem: "relationship", defType: layerName + "InternalRel"})
    let sourceIntRels = await getItems({sourceId: nodeId, kindOfItem: "relationship", defType: layerName + "InternalRel"})

    let rels = [...targetExtRels, ...sourceExtRels, ...targetIntRels, ...sourceIntRels]

    let selfRels = []
    let relevantRels = []

    rels.map(rel => {
        if(rel.target === rel.source) selfRels.push(rel)
        else if (nodesInLayer.find(node => (node.id === rel.source && node.id !== nodeId) || (node.id === rel.target && node.id !== nodeId))) relevantRels.push(rel)
    })
    return {relevantRels, selfRels}
}

async function intersect(nodesInLayer, childLayerNodes, layerName, childLayerName) {
    let array = []

    for (let parent of nodesInLayer) {
        let {relevantRels} = await getRelsOfNode(parent.id, nodesInLayer, layerName)
        let children = childLayerNodes.filter(node => node.parentId === parent.id)

        for (let rel of relevantRels) {
            let otherNodeId = rel.source === parent.id ? rel.target : rel.source
            if(!childLayerNodes.find(node => node.id === otherNodeId)) relevantRels.splice(relevantRels.indexOf(rel), 1)
        }

        for (let child of children) {
            let childRelRels = (await getRelsOfNode(child.id, childLayerNodes, childLayerName)).relevantRels
            if (child.title === "Phase") console.log("childRelRels", JSON.stringify(childRelRels, null, 2))
            let isValid = true
            for (let revRel of relevantRels) {
                if (child.title === "Phase") console.log("revRel", JSON.stringify(revRel, null, 2))
                if (!childRelRels.find(rel => rel.parentId === revRel.id)) {
                    isValid = false
                }
            }
            if (isValid) array.push(child)
        }
    }
        return array
}

module.exports = cascade