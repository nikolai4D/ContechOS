const Voc = {
    kindsOfItems: ["node", "relation", "property"],
    layers: [
        ["configDef", "cd"],
        ["configObj", "co"],
        ["typeData", "td"],
        ["instanceData", "id"]
    ],
    relationTypes: [
        [ "ExternalRel", "er"],
        ["InternalRel", "ir"]
    ]
}

module.exports = { Voc }