function Word(
    inString,
    abbr
){
    this.inString = inString
    this.abbr = abbr
}



const Voc = {
    kindsOfItem: [
        "node",
        "relation",
        "property"
    ],
    layers: [
        new Word("configDef","cd"),
        new Word("configObj", "co"),
        new Word("typeData", "td"),
        new Word("instanceData", "id"),
        new Word("prop", "p")
    ],
    relationTypes: {
        none: new Word("", ""),
        exRel: new Word("ExternalRel", "er"),
        inRel: new Word("InternalRel", "ir")
    },
    propertyTypes: {
        none: new Word("", ""),
        pType: new Word("Type", "t"),
        pKey: new Word("Key", "k"),
        pValue: new Word("Val", "v")
    }

}

module.exports = { Voc }