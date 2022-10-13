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

function TreeNode(id, title, layer, children, selected, data, parent){
    this.id = id
    this.title = title
    this.layer = layer
    this.hidden_placeholder = false
    this.parent = parent
    this.children = children
    this.selected = selected
    this.excluded = false
    this.extraFetched = false
    this.data = data
    this.rels = []
    this.viewAll = false
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
        if(this.parent !== null) this.parent.viewAll = false
        this.selected = false
        this.hidden_placeholder = false
        this.viewAll = false
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

Tree.prototype.fructify = function(dbNodes, layer, parent = null){
    const treeNodes = []
    for(let node of dbNodes){
        treeNodes.push(new TreeNode(node.id, node.title, layer,[], false, node, parent))
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
    const selectedNodes = tree.selectedNodesData

    const internalRelsFirstDegree = []
    const includedRels = []

    // This.rels group internal and external rels.
    this.rels.map(rel => {

        // If this node is source and target of the internal rel.
        if(rel.sourceId === this.id && rel.targetId === this.id) internalRelsFirstDegree.push(rel)

        // If the other node of the rel is displayed (then later the rel should be shown).
        else if((rel.sourceId !== this.id && selectedNodes.find(el => el.id === rel.sourceId) !== undefined) ||
            (rel.targetId !== this.id && selectedNodes.find(el => el.id === rel.targetId) !== undefined)) {
            includedRels.push(rel)
        }
    })

    // Nodes whose parent have a relation with another parent, but child have not (example: email and profile
    let excludedFirst = []

    // inclRels only have displayed nodes as source and target.
    for(let inclRel of includedRels){
        const otherNodeId = inclRel.sourceId === this.id ? inclRel.targetId : inclRel.sourceId
        const otherNode = tree.getNodeById(otherNodeId)
        let otherChildrenSelectedIds = otherNode.children.filter(othChild => othChild.selected).map(child => child.id)

        // if the other parent have no selected children, we don't intersect with it (example: profile def is checked bt not profile, all project def children should show up.)
        if(otherChildrenSelectedIds.length === 0) continue

        for(let child of this.children) {
            await child.extraFetch(tree)
            // make sure that the child have a rel descending from the incl rel. Else add it to the excluded list.
            if (child.rels.find(rel => rel.parentId === inclRel.id && otherChildrenSelectedIds.includes(getOtherIdInRel(rel, child.id))) === undefined) {
                excludedFirst.push(child)
            }
        }
    }

    // The excluded then get a chance to be included if they have a rel with a selected child of the other parent.
    for (let excNode of excludedFirst){
        let rescued = false
        // If the excluded node have an internal rel with a sibling, then it get rescued (for example: email got rescued by project

        // Get the childrels of rels that have the same source and target (example: email_to_project is child of projectdef_to_projectDef)
        let fdRels = excNode.rels.filter(rel => internalRelsFirstDegree.find(parentRel => rel.parentId === parentRel.id))
        for ( let rel of fdRels) {
            let otherNodeId = (rel.sourceId === excNode.id)? rel.sourceId : rel.targetId

            //After making sure that the other node is not also excluded, we rescue it.
            if(!excludedFirst.includes(otherNodeId)) rescued = true
        }

        if(rescued === false) {
            excNode.selected = false
            excNode.excluded = true
        }
    }



}

TreeNode.prototype.unHideLineage = function(){
    this.excluded = false
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
                    if(rel.sourceId === rel.targetId) relevantRels.push(rel)
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
    if(this.layer<3) this.children = await tree.fructify(await queryNodeChildren(this.id), this.layer + 1, this)
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
            let treeNode = nodesToExtraFetch[i/2]
            treeNode.children = this.fructify(resolutions[i].data.nodes, nodesToExtraFetch[i / 2].layer + 1, treeNode)
            treeNode.setRelations([...resolutions[i+1].data.sourceRels, ...resolutions[i+1].data.targetRels])
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