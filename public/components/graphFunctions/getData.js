import getDefType from "./getDefType.js";

export default function (defTitle, detTypeTitle) {
  const definitions = JSON.parse(sessionStorage.getItem("definitions"))[0];
  let definiton = definitions.defs.find((obj) => obj.title === defTitle)
    .defTypes;
  let defTypeByDefintion = definiton.find((obj) => {
    return obj.title === detTypeTitle;
  });

  let contextMenuContent = defTypeByDefintion.contextMenu;

  return contextMenuContent.map((element) => {
    return getDefType(element.defId, element.defTypeId);
  });
}
