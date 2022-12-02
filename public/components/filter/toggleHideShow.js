import { eyeFillHide, eyeFillShow, chevronDown, chevronUp } from "../Icons.js"
import {State} from "../../store/State.js";

export function eyeFunc (e){
    const targetId = e.target.id.split("_")
    const nodeId = `${targetId[1]}_${targetId[2]}`
    let treeNode = State.treeOfNodes.getNodeById(nodeId)
    treeNode.hidden = !treeNode.hidden
}

export function chevronFunc(e){
    const targetId = e.target.id.split("_")
    const nodeId = `${targetId[1]}_${targetId[2]}`
    let treeNode = State.treeOfNodes.getNodeById(nodeId)
    treeNode.expanded = !treeNode.expanded
}

export const iconEye = (nodeId) => {
    const iconClass = "text-secondary";
    const iconMoreConfig = `id="toggleEyeHide_${nodeId}" role="button"`;

    const show = eyeFillShow(iconClass, iconMoreConfig);
    const hide = eyeFillHide(iconClass, iconMoreConfig);
    return { show, hide };
}

export const iconChevron = (nodeId) => {
    const iconClass = "text-secondary";
    const iconMoreConfig = `id="toggleChevron_${nodeId}" role="button"`;

    const up = chevronUp(iconClass, iconMoreConfig);
    const down = chevronDown(iconClass, iconMoreConfig);
    return { up, down };
}

