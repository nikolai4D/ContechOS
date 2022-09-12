const Voc = {
    kindsOfItem: [
        "node",
        "relation",
        "property"
    ],
    layers: [
        ["configDef", "cd"],
        ["configObj", "co"],
        ["typeData", "td"],
        ["instanceData", "id"]
    ],
    relationTypes: [
        [ "ExternalRel", "er"],
        ["InternalRel", "ir"]
    ],
    propertyTypes: [
        ["propType", "pt"],
        ["propKey", "pk"],
        ["propValue", "pv"]
    ]
}

module.exports = { Voc }