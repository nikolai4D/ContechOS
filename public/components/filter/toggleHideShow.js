import { eyeFillHide, eyeFillShow } from "../Icons.js"
import {State} from "../../store/State.js";

export default function (e){
    const targetId = e.target.id.split("_")
    const nodeId = `${targetId[1]}_${targetId[2]}`
    let treeNode = State.treeOfNodes.getNodeById(nodeId)
    treeNode.hidden = !treeNode.hidden
}

export const iconEye = (nodeId) => {
    const iconClass = "text-secondary";
    const iconMoreConfig = `id="toggleEyeHide_${nodeId}" role="button"`;

    const show = eyeFillShow(iconClass, iconMoreConfig);
    const hide = eyeFillHide(iconClass, iconMoreConfig);
    return { show, hide };
}

