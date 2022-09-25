import {State} from "../State.js";
import {queryDefinitions, queryNodeChildren, queryRelations} from "./dbStore.js";

export function Tree() {
    this.tree = null
    this.visibleRelations = []
    this.visibleNodesData = []
}

Tree.prototype.ensureInit = async function () {
    if(this.tree === null) {
    const defNodes = await queryDefinitions()
    this.tree = this.fructify(defNodes, 0)}
}

function TreeNode(id, title, layer, children, visible, data){
    this.id = id
    this.title = title
    this.layer = layer
    this.children = children
    this.visible = visible
    this.extraFetched = false
    this.data = data
    this.rels = []
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

TreeNode.prototype.getVisibleInLineage = function(){
    const data = []
    if(this.visible === true) {
        data.push(this.data)
        for (let child of this.children) {
            data.push(...child.getVisibleInLineage())
        }
    }
    return data
}

Tree.prototype.setVisibleNodesData = function(){
    const data = []
    if(this.tree === null) return data
    for(let node of this.tree){
        data.push(...node.getVisibleInLineage())
    }
    this.visibleNodesData = data
    return data
}

TreeNode.prototype.hideLineage = function(){
    if(this.visible === true) {
        this.visible = false
        for (let child of this.children) {
            child.hideLineage()
        }
    }
}

Tree.prototype.fructify = function(dbNodes, layer){
    const treeNodes = []
    for(let node of dbNodes){
        treeNodes.push(new TreeNode(node.id, node.title, layer,[], this.visibleNodesData.includes(el => el.id === node.id), node))
    }
    return treeNodes
}


TreeNode.prototype.setRels = async function () {
    const relations = await queryRelations(this.id)
    //console.log("relations: " + JSON.stringify(relations, null, 2))
    relations.map( rel => {
        this.rels.push(rel)
        if(State.relations.find(el => el.id === rel.id) === undefined) State.relations.push(rel)
    } )
}

TreeNode.prototype.setChildrenVisibility = async function (visibleNodes) {
    await this.extraFetch()
    const visibleRels = this.rels.filter(rel =>
        (rel.sourceId !== this.id && visibleNodes.includes(el => el.id === rel.sourceId)) ||
        (rel.targetId !== this.id && visibleNodes.includes(el => el.id === rel.targetId))
    )

    const visRelsIds = visibleRels.map(rel => rel.id)
    for (let  visibleRel of visRelsIds) {
        for (let child of this.children) {
            for (let childRel of child.rels) {
                if (visRelsIds.includes(childRel.parentId)) child.visible = true
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

Tree.prototype.shake = async function () {

    this.setVisibleNodesData()
    this.relsToDisplay = []
    let nodesOnThisLayer = this.tree
    let nodesOnNextLayer = []
    this.relsToDisplay = []

    for(let i=0; i<3;i++) {
        for (let node of nodesOnThisLayer) {
            if (node.visible) {

                await node.extraFetch(this)
                await node.setChildrenVisibility(this.visibleNodesData)
                console.log("rels: " + JSON.stringify(node.rels, null, 2))
                const relevantRels = []
                node.rels.map(rel => {
                    if(rel.sourceId !== node.id && this.visibleNodesData.find(el => el.id === rel.sourceId) !== undefined) relevantRels.push(rel)
                })
                this.relsToDisplay.push(...relevantRels)
                nodesOnNextLayer.push(...node.children)
            }
        }
        nodesOnThisLayer = nodesOnNextLayer
        nodesOnNextLayer = []
    }
    console.log("relsToDisplay: " + JSON.stringify(this.relsToDisplay, null, 2))
}

TreeNode.prototype.overview = function(){
    return {
        id: this.id,
        title: this.title,
        visible: this.visible,
        children: this.children.map(child => child.overview())
    }
}

Tree.prototype.overview = function(){
    return this.tree.map(node => node.overview())
}
