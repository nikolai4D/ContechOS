function word(
    inString,
    abbr
) {
    this.inString = inString
    this.abbr = abbr
}

const voc = {
    kindsOfItem: [
        "node",
        "relationship",
        "property"
    ],
    layers: [
        new word("configDef", "cd"),
        new word("configObj", "co"),
        new word("typeData", "td"),
        new word("instanceData", "id"),
        new word("prop", "p")
    ],
    relationshipTypes: {
        none: new word("", ""),
        exRel: new word("ExternalRel", "er"),
        inRel: new word("InternalRel", "ir")
    },
    propertyTypes: {
        none: new word("", ""),
        pType: new word("Type", "t"),
        pKey: new word("Key", "k"),
        pValue: new word("Val", "v")
    }

}

module.exports = { voc }