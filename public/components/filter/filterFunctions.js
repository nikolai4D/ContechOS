import {State} from "../../store/State.js";
import {triggerTreeGetHtml} from "./FilterBox.js";
import {eyeFunc, chevronFunc} from "./toggleHideShow.js";
import {createHtmlElementWithData} from "../DomElementHelper.js";
import Modal from "../Modal.js";

import  Graph  from "../graph/Graph.js"
import { updateFilterBox } from "./updateFilterBox.js";


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
    filterBoxNode.addEventListener("dragstart", async (event) => {
        setDragEvent(event, document.querySelector("#data-display-grid-container-id"))
    })

    filterBoxNode.querySelectorAll(".form-check-input, i").forEach(box =>
        box.addEventListener("click", async function(e) {
            if(e.currentTarget.id.startsWith('all')){
                await checkAll(e)
            }
            else if (e.currentTarget.id.startsWith('checkbox')){
                await checkFilter(e)
            }
            else if (e.currentTarget.id.startsWith('toggleEye')){
                eyeFunc(e)
            }
            else if (e.currentTarget.id.startsWith('toggleChevron')){
                chevronFunc(e)
            }
            else return
            const scrollPosition = document.querySelector("#accordion-body-id").scrollTop
            await updateData()
            await redrawData();
            let filterboxBody = document.querySelector("#accordion-body-id")
            filterboxBody.innerHTML = ""
            filterboxBody.innerHTML = await triggerTreeGetHtml()
            setFilterBoxCallback(filterboxBody, redrawData)
            resizeFilterBox()
            document.querySelector("#accordion-body-id").scrollTop = scrollPosition
    }))
}

function setDragEvent(e, div){

    document.querySelector("#app").addEventListener("dragover", function(e) {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
    })

    let offsets = div.getBoundingClientRect();
    let top = offsets.top;
    let left = offsets.left;

    let cursorDivXOffset = e.clientX - left
    let cursorDivYOffset = e.clientY - top

    let moveDiv = (e)=>{

        let cursorPosX = e.clientX
        let cursorPosY = e.clientY

        let divOffsets = div.firstElementChild.firstElementChild.getBoundingClientRect();
        let divWidth = divOffsets.width;
        let divHeight = divOffsets.height;

        let appOffsets = document.querySelector("#app").getBoundingClientRect();
        let appTop = appOffsets.top;
        let appWidth = appOffsets.width;
        let appBottom = appOffsets.bottom;

        div.style.left = Math.min(Math.max((cursorPosX - cursorDivXOffset), 0),appWidth - divWidth) + "px"
        div.style.top =  Math.min(Math.max(cursorPosY - cursorDivYOffset, appTop), appBottom - divHeight) + "px"

        resizeFilterBox()
        div.removeEventListener("dragend", (e) => moveDiv(e))
    }

    div.addEventListener("dragend", e => moveDiv(e))

}


function resizeFilterBox(){
    let accordion =  document.getElementById("accordion-body-id")
    accordion.style.height = "auto"

    let div = document.querySelector("#data-display-grid-container-id")

    let divOffsets = div.firstElementChild.firstElementChild.getBoundingClientRect();
    let divBottom = divOffsets.bottom

    let appOffsets = document.querySelector("#app").getBoundingClientRect();
    let appHeight = appOffsets.height;

    if(divBottom > appHeight){
        let accordion =  document.getElementById("accordion-body-id")
        let accordionTop = accordion.getBoundingClientRect().top
        accordion.style.height = appHeight - accordionTop + "px"
        accordion.style.overflowY = "scroll"
    }
}

export function addFunctionsToFilterbox(graphDisplayFunc, tableDisplayFunc, checked, containerNode, reRenderGraph) {
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

    let intersectChecked = State.treeOfNodes.intersect? "checked" : ""
    const switchIntersectionInput = createHtmlElementWithData("input", { "type": "checkbox"})
    switchIntersectionInput.checked = intersectChecked
    switchIntersectionInput.style.marginRight ="1.2em"

    containerNode.appendChild(switchIntersectionInput);
    switchIntersectionInput.addEventListener("click", async (event, state) => {
            await switchIntersection(reRenderGraph);
            await updateData()
            await reRenderGraph()
        });

    switchDiv.appendChild(switchInput)
    switchDiv.appendChild(switchLabel)
    containerNode.appendChild(switchDiv);

    //Delete Modal Content if there is already one.
    let modalDialog = document.querySelector("#modal-dialog")
    if(modalDialog){ modalDialog.remove() }

    const containerModal = createHtmlElementWithData("div", {"id": "containerModal", "class":"" })
    let modal = Modal()
    containerModal.innerHTML = modal.modalButton
    let modalContent = modal.modalContent
    document.body.appendChild(modalContent)
    containerNode.appendChild(containerModal);

    //let intersectChecked = State.treeOfNodes.intersect? "checked" : ""
    //containerNode.insertAdjacentHTML("afterbegin", ` <input data-function="switchIntersection" ${intersectChecked} type="checkbox">`)

}

export async function switchIntersection(reRender){
    State.treeOfNodes.intersect = !State.treeOfNodes.intersect

    let tree = State.treeOfNodes.tree 

    if (tree.intersect) tree.forEach(node => node.deselectLineage())

    await State.treeOfNodes.shake()
    await updateFilterBox(reRender, "filter")
    resizeFilterBox()
    console.log(State.treeOfNodes)

}

export default addFunctionsToFilterbox
