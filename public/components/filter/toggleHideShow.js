import { eyeFillHide, eyeFillShow } from "../Icons.js"

export default function (e){

    const nodeId = getNodeIdIconType(e).nodeId;
    const { hide, show } = iconEye(nodeId);
    const iconType = getNodeIdIconType(e).iconType;
    const newIcon = iconType === "Show" ? hide : show
    
    document.getElementById(`toggleEyeContainer_${nodeId}`).innerHTML = newIcon;
}


export const getNodeIdIconType = (e) => {
    const targetId = e.target.id.split("_")
    const buttonType = targetId[0]
    const nodeId = `${targetId[1]}_${targetId[2]}`
    const iconType = buttonType.split("toggleEye")[1]

    return {nodeId, iconType}
}

export const iconEye = (nodeId) => {
    const iconClass = "text-secondary";
    const iconMoreConfigShow = `data-function="toggleHideShow" id="toggleEyeShow_${nodeId}" role="button"`;
    const iconMoreConfigHide = `data-function="toggleHideShow" id="toggleEyeHide_${nodeId}" role="button"`;

    const show = eyeFillShow(iconClass, iconMoreConfigShow);
    const hide = eyeFillHide(iconClass, iconMoreConfigHide);
    return { show, hide };
}

