import {State} from "../../store/State.js";
import {triggerTreeGetHtml} from "./FilterBox.js";
import toggleHideShow from "./toggleHideShow.js";

export async function checkFilter(event) {
    const tree = State.treeOfNodes

    let input =getInputFromEvent(event)
    input.toggleAttribute("checked")

    const treeNode = tree.getNodeById(input.id.substring(9))
    treeNode.selected? treeNode.deselectLineage() : treeNode.selected = true
}

export async function checkAll(event) {
    let input = getInputFromEvent(event)
    input.toggleAttribute("checked")

    const tree = State.treeOfNodes
    const treeNode = tree.getNodeById(input.id.substring(4))
    treeNode.viewAll = !treeNode.viewAll
    if (treeNode.viewAll) {
        treeNode.selectChildren()
    } else {
        treeNode.deselectLineage()
        treeNode.selected = true
    }
}

function getInputFromEvent(event){
    if(event.target.tagName === "LABEL") return document.getElementById(event.target.getAttribute("for"))
    else if ( event.target.tagName === "INPUT" ) return event.target
}

async function updateData(){
    const tree = State.treeOfNodes
    await tree.shake()
    const {nodes, relations} = tree.getVisibleData()
    sessionStorage.setItem("filter", JSON.stringify([{nodes: nodes , rels: relations }]));
}

export async function setFilterBoxCallback(filterBoxNode, redrawData){
    filterBoxNode.querySelectorAll(".form-check-input, i").forEach(box =>
        box.addEventListener("click", async function(e) {
            if(e.currentTarget.id.startsWith('all')){
                await checkAll(e)
            }
            else if (e.currentTarget.id.startsWith('checkbox')){
                await checkFilter(e)
            }
            else if (e.currentTarget.id.startsWith('toggleEye')){
                toggleHideShow(e)
            }

            await updateData()
            await redrawData();
            let filterboxBody = document.querySelector("#accordion-body-id")
            filterboxBody.innerHTML = ""
            filterboxBody.innerHTML = await triggerTreeGetHtml()
            setFilterBoxCallback(filterboxBody, redrawData)
    }))
}

export function addFunctionsToFilterbox(graphDisplayFunc, tableDisplayFunc, checked, containerNode) {
    const switchDiv = createHtmlElementWithData("div", { "class": "form-check form-switch align-self-center"})
    const switchInput = createHtmlElementWithData("input", {
        "class": "form-check-input",
        "type": "checkbox", "role": "switch", "id": "flexSwitchCheckDefault"
    })
    if(checked()){
        switchInput.setAttribute("checked", "")
    }
    const switchLabel = createHtmlElementWithData("label", {
        "class": "form-check-label",
        "for": "flexSwitchCheckDefault",
    });
    switchInput.addEventListener("click", async (event, state) => {
        if (!event.target.checked) {
        graphDisplayFunc()
        } else {
        tableDisplayFunc()
        }
    });
    switchDiv.appendChild(switchInput)
    switchDiv.appendChild(switchLabel)
    containerNode.appendChild(switchDiv);
    const containerModal = createHtmlElementWithData("div", {"id": "containerModal", "class":"" })
    containerModal.innerHTML=`${Modal()}`
    containerNode.appendChild(containerModal);
}

export default setupToolBar;
