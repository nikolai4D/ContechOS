import {State} from "../../store/State.js";

async function checkFilter(event) {
    let input
    if(event.target.tagName === "LABEL") input = document.getElementById(event.target.getAttribute("for"))
    else if ( event.target.tagName === "INPUT" ) input = event.target
    else console.log("tagname: " + event.target.tagName)
    input.toggleAttribute("checked")

    const checkBoxParent = event.target.parentElement
    const ids = []
    checkBoxParent.querySelectorAll("input").forEach((input) => {
        if(input.hasAttribute("checked")){
            ids.push(input.getAttribute("id").substring(9))
        }
    })

    console.log("ParsedIds: " + ids)
}


export default checkFilter;