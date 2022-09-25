import {State} from "../../store/State.js";
import navigateTo from "../../helpers/navigateTo.js";

async function checkFilter(event) {
    const tree = State.treeOfNodes

    let input
    if(event.target.tagName === "LABEL") input = document.getElementById(event.target.getAttribute("for"))
    else if ( event.target.tagName === "INPUT" ) input = event.target
    else console.log("tagname: " + event.target.tagName)
    input.toggleAttribute("checked")

    tree.getNodeById(input.id.substring(9)).visible = input.checked
    if(!input.checked) State.selectedNodes.push(input.id.substring(9))
    else State.selectedNodes.splice(State.selectedNodes.indexOf(input.id.substring(9)), 1)

    await tree.shake()

    navigateTo('/filter')
}

export default checkFilter;