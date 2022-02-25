import getDefType from "./getDefType.js";

export default function (defTitle, defTypeTitle) {
  const definitions = JSON.parse(sessionStorage.getItem("definitions"))[0];
  let definiton = definitions.defs.find((obj) => obj.defTitle === defTitle)
    .defTypes;
  let defTypeByDefintion = definiton.find((obj) => {
    return obj.defTypeTitle === defTypeTitle;
  });

  console.log(defTypeByDefintion, "defTypeByDefintion");

  let contextMenuContent = defTypeByDefintion.contextMenu;

  return contextMenuContent.map((element) => {
    return getDefType(element.defId, element.defTypeId);
  });
}
