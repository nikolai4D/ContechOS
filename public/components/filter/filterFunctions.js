import {State} from "../../store/State.js";
import navigateTo from "../../helpers/navigateTo.js";
import {FilterBox} from "./FilterBox.js";

export async function checkFilter(event) {
    const tree = State.treeOfNodes

    let input =getInputFromEvent(event)
    console.log(input)
    input.toggleAttribute("checked")

    const treeNode = tree.getNodeById(input.id.substring(9))
    treeNode.selected? treeNode.deselectLineage() : treeNode.selected = true

    await tree.shake()

    tree.visibleRelations.map(rel => {
        rel.source = rel.sourceId
        rel.target = rel.targetId
        return rel
    })

    sessionStorage.setItem("filter", JSON.stringify([{nodes: tree.selectedNodesData , rels: tree.visibleRelations }]));
}

export async function checkAll(event) {
    let input = getInputFromEvent(event)
    input.toggleAttribute("checked")

    const tree = State.treeOfNodes
    const treeNode = tree.getNodeById(input.id.substring(4))
    treeNode.isViewAllChecked = !treeNode.isViewAllChecked
    if (treeNode.isViewAllChecked) {
        treeNode.selectChildren()
    } else {
        treeNode.deselectLineage()
        treeNode.selected = true

    }

    await tree.shake()

    tree.visibleRelations.map(rel => {
        rel.source = rel.sourceId
        rel.target = rel.targetId
        return rel
    })

    sessionStorage.setItem("filter", JSON.stringify([{nodes: tree.selectedNodesData , rels: tree.visibleRelations }]));
}

export async function setFilterBoxCallback(parentNode, filterBoxNode, callbackFunc){
    filterBoxNode.querySelectorAll(".form-check-input").forEach(box => 
        box.addEventListener("click", async function(e) {
        await checkFilter(e)
        await callbackFunc();
        document.querySelector("#filter-container-id").remove()
        let newFilterBox = await FilterBox()
        parentNode.appendChild(newFilterBox);
        setFilterBoxCallback(parentNode, newFilterBox, callbackFunc)
    }))
}

function getInputFromEvent(event){
    if(event.target.tagName === "LABEL") return document.getElementById(event.target.getAttribute("for"))
    else if ( event.target.tagName === "INPUT" ) return event.target
    else console.log("tagname: " + event.target.tagName)
}

export default checkFilter;
