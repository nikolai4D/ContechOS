import {State} from "../../store/State.js";
import navigateTo from "../../helpers/navigateTo.js";

async function checkFilter(event) {
    let input
    if(event.target.tagName === "LABEL") input = document.getElementById(event.target.getAttribute("for"))
    else if ( event.target.tagName === "INPUT" ) input = event.target
    else console.log("tagname: " + event.target.tagName)
    input.toggleAttribute("checked")

    findInBoxNodes(input.id.substring(9)).checked = input.checked

    navigateTo('/filter')
}

function findInBoxNodes(id){
    try {
        for(let node of State.treeOfNodes){
            if(node.id === id) return node
            if(node.hasOwnProperty("children")){
                for(let child of node.children){
                    let foundNode = findInBoxNodes(child, id)
                    if(foundNode) return foundNode
                }
            }
        }
        throw new Error("No node found with id: " + id)
    } catch (e) {
        console.log(e)
    }
}

export default checkFilter;