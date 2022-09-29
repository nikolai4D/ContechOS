import {State} from "../../store/State.js";
import navigateTo from "../../helpers/navigateTo.js";
import { appendChildsToSelector } from "../table/dataRendererHelper.js";
import Graph from "../graph/Graph.js";
import FilterBox from "./FilterBox.js";

async function checkFilter(event) {
    const tree = State.treeOfNodes

    let input =getInputFromEvent(event)
    input.toggleAttribute("checked")

    const treeNode = tree.getNodeById(input.id.substring(9))
    treeNode.selected? treeNode.deselectLineage() : treeNode.selected = true

    await tree.shake()
    console.log(State.graphObject)

    var div = document.querySelector('#filter-container-box');
    if (div) {
        div.parentNode.removeChild(div);
    }
    await tree.ensureInit()
    tree.visibleRelations.map(rel => {
        rel.source = rel.sourceId
        rel.target = rel.targetId
        return rel
    })
    await sessionStorage.setItem("filter", JSON.stringify([{nodes: tree.selectedNodesData , rels: tree.visibleRelations }]));
    //const update = State.graphObject['updateGraphFunc']
    //await update('filter')
    //appendChildsToSelector("#app", await FilterBox())
    document.querySelector("#app").innerHTML = ""
    const mainAppNodes = await Graph('filter')
    const filterBoxNodes = await FilterBox()
    appendChildsToSelector("#app", [mainAppNodes,filterBoxNodes])
    //navigateTo('/filter')
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
    }

    await tree.shake()

    navigateTo('/filter')
}

function getInputFromEvent(event){
    if(event.target.tagName === "LABEL") return document.getElementById(event.target.getAttribute("for"))
    else if ( event.target.tagName === "INPUT" ) return event.target
    else console.log("tagname: " + event.target.tagName)
}

export default checkFilter;