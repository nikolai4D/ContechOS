export default function (defId, defTypeId) {
  const definitions = JSON.parse(sessionStorage.getItem("definitions"))[0];
  let def = definitions.defs.find((obj) => obj.defId === defId);
  let defType = def.defTypes.find((obj) => obj.defTypeId === defTypeId);
  defType.defId = defId;
  return defType;
}
