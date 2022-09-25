import {State} from "../State.js";
import {queryDefinitions, queryNodeChildren, queryRelations} from "./dbStore.js";

export function Tree() {
    this.tree = null
    this.visibleRelations = []
    this.selectedNodesData = []
}

Tree.prototype.ensureInit = async function () {
    if(this.tree === null) {
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
        if(this.rels.find(el => el.id === rel.id) === undefined) this.rels.push(rel)
        if(State.relations.find(el => el.id === rel.id) === undefined) State.relations.push(rel)
    } )
}

TreeNode.prototype.setChildrenVisibility = async function (tree) {
    const visibleNodes = tree.selectedNodesData
    await this.extraFetch()
    const visibleRels = this.rels.filter(rel =>
        (rel.sourceId !== this.id && visibleNodes.find(el => el.id === rel.sourceId) !== undefined) ||
        (rel.targetId !== this.id && visibleNodes.find(el => el.id === rel.targetId) !== undefined)
    )

    const visRelsIds = visibleRels.map(rel => rel.id)
    console.log("visRelsIds: " + JSON.stringify(visRelsIds, null, 2))
    for (let visibleRel of visRelsIds) {
        for(let child of this.children) {
            await child.extraFetch(tree)
            if (child.rels.find(rel => rel.parentId === visibleRel) === undefined) {
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

TreeNode.prototype.unHideAll = function(){
    this.hidden = false
    for(let child of this.children){
        child.unHideAll()
    }
}

Tree.prototype.unHideAll = function(){
for(let node of this.tree){
        node.unHideAll()
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
