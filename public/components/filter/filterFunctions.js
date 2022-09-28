import {State} from "../../store/State.js";
import navigateTo from "../../helpers/navigateTo.js";

async function checkFilter(event) {
    const tree = State.treeOfNodes

    let input =getInputFromEvent(event)
    input.toggleAttribute("checked")

    const treeNode = tree.getNodeById(input.id.substring(9))
    treeNode.selected? treeNode.deselectLineage() : treeNode.selected = true

    await tree.shake()

    navigateTo('/filter')
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