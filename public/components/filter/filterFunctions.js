import {State} from "../../store/State.js";
import {FilterBox} from "./FilterBox.js";
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

async function updateData(){
    const tree = State.treeOfNodes
    await tree.shake()
    const {nodes, relations} = tree.getVisibleData()
    sessionStorage.setItem("filter", JSON.stringify([{nodes: nodes , rels: relations }]));
}

export async function setFilterBoxCallback(parentNode, filterBoxNode, callbackFunc){
    filterBoxNode.querySelectorAll(".form-check-input, i").forEach(box =>
        box.addEventListener("click", async function(e) {
            console.log("callbacked")
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
