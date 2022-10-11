import {State} from "../State.js";
import {
    asyncQueryNodeChildren,
    asyncQueryRelations,
    queryDefinitions,
    queryNodeChildren,
    queryRelations
} from "./treeQueries.js";

export function Tree() {
    this.tree = []
    this.visibleRelations = []
    this.selectedNodesData = []
    this.selectedTreeNodes = []
}

Tree.prototype.ensureInit = async function () {
    if(this.tree.length === 0) {
    const defNodes = await queryDefinitions()
    this.tree = this.fructify(defNodes, 0)}
}

function TreeNode(id, title, layer, children, selected, data){
    this.id = id
    this.title = title
    this.layer = layer
    this.children = children
    this.selected = selected
    this.hidden = false
    this.extraFetched = false
    this.data = data
    this.rels = []
    this.isViewAllChecked = false
}


TreeNode.prototype.findIdInLineage = function(id){
    if(this.id === id) return this
    if(this.children.length !== 0){
        for(let child of this.children){
            let found = child.findIdInLineage(id)
            if(found) return found
        }
    }
}

Tree.prototype.getNodeById = function(id){
    for (let node of this.tree){
        let found = node.findIdInLineage(id)
        if(found) return found
    }
    throw new Error("No node found with id: " + id)
}

/**
 *
 * @returns {*[TreeNode]}
 */
TreeNode.prototype.getSelectedInLineage = function(){
    const selectedTreeNodes = []
    if(this.selected === true) {
        selectedTreeNodes.push(this)
        for (let child of this.children) {
            selectedTreeNodes.push(...child.getSelectedInLineage())
        }
    }
    return selectedTreeNodes
}

Tree.prototype.setSelectedNodesAndData = function(){
    const selectedTreeNodes = []
    if(this.tree === null) return []
    for(let node of this.tree){
        selectedTreeNodes.push(...node.getSelectedInLineage())
    }
    this.selectedTreeNodes = selectedTreeNodes
    this.selectedNodesData = selectedTreeNodes.map(node => node.data)
}

TreeNode.prototype.deselectLineage = function(){
    if(this.selected === true) {
        this.selected = false
        this.isViewAllChecked = false
        for (let child of this.children) {
            child.deselectLineage()
        }
    }
}

TreeNode.prototype.selectChildren = function(){
    for(let child of this.children){
        child.selected = true
    }
}

Tree.prototype.fructify = function(dbNodes, layer){
    const treeNodes = []
    for(let node of dbNodes){
        treeNodes.push(new TreeNode(node.id, node.title, layer,[], false, node))
    }
    return treeNodes
}

function getOtherIdInRel(rel, id){
    if(rel.sourceId === id) return rel.targetId
    else if (rel.targetId === id) return rel.sourceId
    else throw new Error("No id found in relation")
}

function createPseudoParentRel(parentId, childId){
    return {
        sourceId: childId,
        targetId: parentId,
        title:"has parent",
    }
}

TreeNode.prototype.setChildrenVisibility = async function (tree) {
    const visibleNodes = tree.selectedNodesData
    // await this.extraFetch()
    const visibleRels = this.rels.filter(rel =>
        (rel.sourceId !== this.id && visibleNodes.find(el => el.id === rel.sourceId) !== undefined) ||
        (rel.targetId !== this.id && visibleNodes.find(el => el.id === rel.targetId) !== undefined)
    )

    for(let visibleRel of visibleRels){
        const otherNodeId = visibleRel.sourceId === this.id ? visibleRel.targetId : visibleRel.sourceId
        const otherNode = tree.getNodeById(otherNodeId)
        // await otherNode.extraFetch(tree)
        let otherChildrenSelectedIds = otherNode.children.filter(othChild => othChild.selected).map(child => child.id)

        if(otherChildrenSelectedIds.length === 0) continue

        for(let child of this.children) {
            await child.extraFetch(tree)
            if (child.rels.find(rel => rel.parentId === visibleRel.id && otherChildrenSelectedIds.includes(getOtherIdInRel(rel, child.id))) === undefined) {
                child.hidden = true
                child.selected = false
            }
        }
    }
}

TreeNode.prototype.unHideLineage = function(){
    this.hidden = false
    for(let child of this.children){
        child.unHideLineage()
    }
}

Tree.prototype.unHideAll = function(){
for(let node of this.tree){
        node.unHideLineage()
    }
}

Tree.prototype.shake = async function () {
    this.unHideAll()
    this.setSelectedNodesAndData()
    await this.extraFetchAllSelected()
    this.visibleRelations = []
    let nodesOnThisLayer = this.tree
    let nodesOnNextLayer = []


    for(let i=0; i<3;i++) {
        for (let node of nodesOnThisLayer) {
            if (node.selected) {

                // await node.extraFetch(this)
                await node.setChildrenVisibility(this)
                node.children.map (child=> {
                    if(child.selected) this.visibleRelations.push(createPseudoParentRel(node.id, child.id))
                })
                const relevantRels = []
                node.rels.map(rel => {
                    if(rel.sourceId !== node.id && this.selectedNodesData.find(el => el.id === rel.sourceId) !== undefined) relevantRels.push(rel)
                })
                this.visibleRelations.push(...relevantRels)
                nodesOnNextLayer.push(...node.children)
            }
        }
        nodesOnThisLayer = nodesOnNextLayer
        nodesOnNextLayer = []
    }

    this.setSelectedNodesAndData()
    this.trimVisibleRelations()
}

Tree.prototype.trimVisibleRelations = function(){
    this.visibleRelations = this.visibleRelations.filter(rel => {
        const source = this.selectedNodesData.find(el => el.id === rel.sourceId)
        const target = this.selectedNodesData.find(el => el.id === rel.targetId)
        return source !== undefined && target !== undefined
    })
}

TreeNode.prototype.overview = function(){
    return {
        id: this.id,
        title: this.title,
        selected: this.selected,
        children: this.children.map(child => child.overview())
    }
}

Tree.prototype.overview = function(){
    return this.tree.map(node => node.overview())
}

TreeNode.prototype.extraFetch = async function (tree,force = false) {
    if(this.extraFetched && !force) return
    this.extraFetched = true
    if(this.layer<3) this.children = await tree.fructify(await queryNodeChildren(this.id), this.layer + 1)
    this.setRelations(await queryRelations(this.id))
}


TreeNode.prototype.asyncExtraFetch = function (tree, force = false) {
    if (this.extraFetched && !force) return
    this.extraFetched = true

    const childrenPromise = this.layer < 3 ? asyncQueryNodeChildren(this.id) : Promise.resolve({data: {nodes: []}})
    const relsPromise = asyncQueryRelations(this.id)

    return {childrenPromise, relsPromise}
}

Tree.prototype.extraFetchAllSelected = async function(){
    const promises = []
    const nodesToExtraFetch = []
    //Get promises
    for(let node of this.selectedTreeNodes){
        if(!node.extraFetched) {
            const extraObject = node.asyncExtraFetch(this)
            if(extraObject !== undefined) {
                promises.push(extraObject.childrenPromise)
                promises.push(extraObject.relsPromise)
                nodesToExtraFetch.push(node)
            }
        }
    }

    const resolutions = await Promise.all(promises)
    //Map resolutions to nodes
    if(resolutions.length !== 2*nodesToExtraFetch.length) throw new Error("Resolutions and nodes to extra fetch lengths don't match: " + resolutions.length + " " + nodesToExtraFetch.length)
    else {
        for(let i=0; i<resolutions.length; i+=2){
            nodesToExtraFetch[i/2].children = this.fructify(resolutions[i].data.nodes, nodesToExtraFetch[i / 2].layer + 1)
            nodesToExtraFetch[i/2].setRelations([...resolutions[i+1].data.sourceRels, ...resolutions[i+1].data.targetRels])
        }
    }

}

TreeNode.prototype.setRelations = function (relations) {
    relations.map( rel => {
        const stateRel = State.relations.find(stateRel => stateRel.id === rel.id)
        if (stateRel === undefined) {
            State.relations.push(rel)
            this.rels.push(rel)
        } else if (this.rels.find(rel => rel.id === stateRel.id) === undefined) this.rels.push(stateRel)
    })
}

TreeNode.prototype.getCascadeParamsInLineage = function(cascadeParams, isParentViewAllChecked = false){
    if(this.selected === false ) return

    let layers = [
        "configDef",
        "configObj",
        "typeData",
        "instanceData"
    ]

    if(isParentViewAllChecked === false) {
        let layer = layers[this.layer]
        if(!cascadeParams[layer].hasOwnProperty("id")) cascadeParams[layer].id = []
        cascadeParams[layer].id.push(this.id)
    }

    if(this.isViewAllChecked){
        let childLayer = layers[this.layer+1]
        if(!cascadeParams[childLayer].hasOwnProperty("parentId")) cascadeParams[childLayer].parentId = []
        cascadeParams[childLayer].parentId.push(this.id)
    }

    for (let child of this.children){
        child.getCascadeParamsInLineage(cascadeParams, this.isViewAllChecked)
    }
}

Tree.prototype.getCascadeParams = function(){
    let cascadeParams = {
        configDef: {},
        configObj: {},
        typeData: {},
        instanceData: {},
    }

    for(let node of this.tree){
        node.getCascadeParamsInLineage(cascadeParams)
    }

    return cascadeParams
}