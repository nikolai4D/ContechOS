const { getItems } = require("../../dbAccessLayer/crud/read")
const {validateId} = require("../validation/idValidator");

// ToDo: optimize. Refactor.

async function cascade(params = {}) {

    try {
        let configDefNodes = await getAllRequiredNodesFromLayer("configDef", params.configDef)
        let configObjNodes = await getAllRequiredNodesFromLayer("configObj", params.configObj)
        let typeDataNodes = await getAllRequiredNodesFromLayer("typeData", params.typeData)
        let instanceDataNodes = await getAllRequiredNodesFromLayer("instanceData", params.instanceData)

        if (!(params.hasOwnProperty('intersect') && params.intersect === false)) {
            let coWraps = await wrap(configObjNodes, null, "configObj")
            configObjNodes = getValidDataFromWraps(coWraps)
            let tdWraps = await intersection(coWraps, typeDataNodes, "typeData")
            typeDataNodes = getValidDataFromWraps(tdWraps)

            let idWraps = await intersection(tdWraps, instanceDataNodes, "instanceData")
            instanceDataNodes = getValidDataFromWraps(idWraps)
        }

        return {configDefNodes, configObjNodes, typeDataNodes, instanceDataNodes}
    } catch (e) {
        return e
    }
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

function Node(data, parent, rels){
    this.id = data.id
    this.data = data
    this.parent = parent
    this.rels = rels
    this.isValid = true
    this.children = []
    this.dependantSiblings = []
    this.needsValidation = true
}

async function wrap(nodes, parentWraps, layerName){
    let wraps = []
    for (let node of nodes){
        let rels = (await getRelsOfNode(node.id, nodes, layerName)).relevantRels
        let parent = parentWraps === null ? null : parentWraps.find(wrap => wrap.id === node.parentId)
        wraps.push(new Node(node, parent, rels))
    }
    return wraps
}

function getValidDataFromWraps(wraps){
    let array = []
    for (let wrap of wraps) if(wrap.isValid) array.push(wrap.data)
    return array
}

async function intersection(parentWraps, childNodes, childLayerName){
    let childWraps = []

    let validParentWraps = parentWraps.filter(wrap => wrap.isValid)

    for (let parent of validParentWraps){
        let children = childNodes.filter(node => node.parentId === parent.id)
        for (let child of children) {
            let rels = (await getRelsOfNode(child.id, childNodes, childLayerName)).relevantRels
            let childWrap = new Node(child, parent, rels)
            parent.children.push(childWrap)
            childWraps.push(childWrap)
        }
    }

    function validateChildren() {
        for (let parent of validParentWraps) {
            if(parent.rels.length === 0) parent.children.map(child => child.needsValidation = false)
            for (let rel of parent.rels) {
                let otherNodeId = rel.source === parent.id ? rel.target : rel.source
                let otherWrap = validParentWraps.find(wrap => wrap.id === otherNodeId)
                if (otherWrap.children.length === 0 || !otherWrap.children.find(child => child.isValid)) continue

                parent.children.map(child => {
                    if (child.needsValidation === false) return
                    child.needsValidation = false
                    child.isValid = true

                    let matchingRels = child.rels.filter(childRel => childRel.parentId === rel.id)
                    if (matchingRels.length === 0) {
                        child.isValid = false
                        child.dependantSiblings.forEach(sibling => {
                            sibling.needsValidation = true
                        })
                        return
                    }
                    let relIsValid = false
                    for (let matchingRel of matchingRels) {
                        let otherNodeId = matchingRel.source === child.id ? matchingRel.target : matchingRel.source
                        let otherWrap = childWraps.find(wrap => wrap.id === otherNodeId)
                        if (otherWrap.isValid) {
                            relIsValid = true
                            child.dependantSiblings.push(otherWrap)
                        }
                    }
                    if (!relIsValid) {
                        child.isValid = false
                        child.dependantSiblings.forEach(sibling => {
                            sibling.needsValidation = true
                        })
                    }
                })
            }
        }
    }

    let i = 5
    while(i > 0 && validParentWraps.find(wrap => wrap.children.find(child => child.needsValidation))) {
        i--
        validateChildren()
        // let needyChildren = childWraps.filter(wrap => wrap.needsValidation).map(wrap => wrap.data.title)
        // if(needyChildren.length > 0) console.log("needyChildren", needyChildren)
    }

    return childWraps
}


module.exports = cascade