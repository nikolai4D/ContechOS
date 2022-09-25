import {State} from "../State.js";
import {queryDefinitions} from "./dbStore.js";

export function Tree() {
    this.tree = async ()=>
    this.fructify(
        await queryDefinitions()
    )

}

function TreeNode(id, title, children, visible, data){
    this.id = id
    this.title = title
    this.children = children
    this.visible = visible
    this.childrenFetched = false
    this.data = data
    this.rels = () => {

    }
    this.relNodesIds = () => {

    }
}


TreeNode.prototype.findById = function(id){
    if(this.id === id) return this
    if(this.children.length !== 0){
        for(let child of this.children){
            let found = child.findById(id)
            if(found) return found
        }
    }
}

TreeNode.prototype.getVisibleInLineage = function(curlayer, layer){
    if(curlayer === layer && this.checked === true) return this.checked
    else if(this.children.length !== 0){
        for(let child of this.children){
            let found = child.getCheckedInLineage(curlayer + 1, layer)
            if(found) return found
        }
    }
}

Tree.prototype.getNodeById = function(id, title, checked, children){
    for (let node in this.tree){
        let found = node.findById(id)
        if(found) return found
    }
    throw new Error("No node found with id: " + id)
}

Tree.prototype.getCheckedNodesOnLayer = function(layer){
    let checkedNodes = []
    for(let node of this.tree){
        node.getCheckedInLineage(0, layer)
    }
    return checkedNodes
}

Tree.prototype.getAllVisibleNodes = function(){

}

Tree.getAllVisibleRelations = function(){

}

TreeNode.prototype.updateVisibilityInLineage = function(selectedNodes){
    if(selectedNodes.includes(this.id)){
        this.visible = true
        selectedNodes.splice(selectedNodes.indexOf(this.id), 1)
    }
    else {
        this.visible = false
        for(let child of this.children){
            child.updateVisibilityInLineage(selectedNodes)
        }
    }
}

Tree.prototype.updateVisibleNodes = function(selectedNodes){
    for(let node of this.tree){
        node.updateVisibilityInLineage(selectedNodes)
    }
}

Tree.prototype.fructify = async function(dbNodes){
    const treeNodes = []
    for(let node of dbNodes){
        treeNodes.push(new TreeNode(node.id, node.title, [], State.selectedNodes.includes(node.id), node))
    }
    return treeNodes
}