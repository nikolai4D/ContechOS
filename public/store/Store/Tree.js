import {State} from "../State.js";
import {queryDefinitions, queryNodeChildren, queryRelations} from "./dbStore.js";

export function Tree() {
    this.tree = []
    this.visibleRelations = []
    this.selectedNodesData = []
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

TreeNode.prototype.getSelectedInLineage = function(){
    const data = []
    if(this.selected === true) {
        data.push(this.data)
        for (let child of this.children) {
            data.push(...child.getSelectedInLineage())
        }
    }
    return data
}

Tree.prototype.setSelectedNodesData = function(){
    const data = []
    if(this.tree === null) return data
    for(let node of this.tree){
        data.push(...node.getSelectedInLineage())
    }
    this.selectedNodesData = data
    return data
}

TreeNode.prototype.deselectLineage = function(){
    if(this.selected === true) {
        this.selected = false
        for (let child of this.children) {
            child.deselectLineage()
        }
    }
}

TreeNode.prototype.selectChildren = function(){
    for(let child of this.children){
        console.log("selecting child: " + child.title)
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


TreeNode.prototype.setRels = async function () {
    const relations = await queryRelations(this.id)
    relations.map( rel => {
        const stateRel = State.relations.find(stateRel => stateRel.id === rel.id)
        if (stateRel === undefined) {
            State.relations.push(rel)
            this.rels.push(rel)
        } else if (this.rels.find(rel => rel.id === stateRel.id) === undefined) this.rels.push(stateRel)
    })
}

function getOtherIdInRel(rel, id){
    if(rel.sourceId === id) return rel.targetId
    else if (rel.targetId === id) return rel.sourceId
    else throw new Error("No id found in relation")
}

function createPseudoParentRel(parentId, childId){
    const lineageRel = {
        sourceId: childId,
        targetId: parentId,
        title:"has parent",
    }
    console.log("pseudo parent rel created: " + JSON.stringify(lineageRel, null, 2))
    return lineageRel
}

TreeNode.prototype.setChildrenVisibility = async function (tree) {
    const visibleNodes = tree.selectedNodesData
    await this.extraFetch()
    const visibleRels = this.rels.filter(rel =>
        (rel.sourceId !== this.id && visibleNodes.find(el => el.id === rel.sourceId) !== undefined) ||
        (rel.targetId !== this.id && visibleNodes.find(el => el.id === rel.targetId) !== undefined)
    )

    for(let visibleRel of visibleRels){
        const otherNodeId = visibleRel.sourceId === this.id ? visibleRel.targetId : visibleRel.sourceId
        const otherNode = tree.getNodeById(otherNodeId)
        await otherNode.extraFetch(tree)
        let otherChildrenSelectedIds = otherNode.children.filter(othChild => othChild.selected).map(child => child.id)

        if(otherChildrenSelectedIds.length === 0) continue

        console.log("otherChildrenSelectedIds", otherChildrenSelectedIds)
        for(let child of this.children) {
            await child.extraFetch(tree)
            if (child.rels.find(rel => rel.parentId === visibleRel.id && otherChildrenSelectedIds.includes(getOtherIdInRel(rel, child.id))) === undefined) {
                console.log("child hidden: " + child.title)
                child.hidden = true
                child.selected = false
            }
        }
    }
}

TreeNode.prototype.extraFetch = async function (tree,force = false) {
    if(this.extraFetched && !force) return
    this.extraFetched = true
    if(this.layer<3) this.children = await tree.fructify(await queryNodeChildren(this.id), this.layer + 1)
    await this.setRels()
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
    this.setSelectedNodesData()
    this.visibleRelations = []
    let nodesOnThisLayer = this.tree
    let nodesOnNextLayer = []


    for(let i=0; i<3;i++) {
        for (let node of nodesOnThisLayer) {
            if (node.selected) {

                await node.extraFetch(this)
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
