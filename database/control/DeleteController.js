const { IdController } = require("./IdController")

function DeleteController(id){
    this.idCon = new IdController(id)
    this.absenceOfChildren = doesItemHaveChildren(this.idCon)
    this.absenceOfrelsThisIsTargetOf= isItemTarget(this.idCon)

    this.relsItIsSourceOf = getRelsItIsSourceOf(this.idCon)

    this.filesItIsSourceOf = getFilesItIsSourceOf(this.relsItIsSourceOf)

    this.filesToDelete = getFilesToDelete(this.idCon, this.filesItIsSourceOf)
    this.idsToDelete = getIdsToDelete(this.idCon, this.relsItIsSourceOf)
}

function doesItemHaveChildren(idCon){
    if(idCon.layerIndex === 4 || (idCon.layerIndex == 4 && idCon.propertyType.inString === "Val")) return false
    const children = idCon.children()
    if (children.length > 0) throw new Error("Cannot delete an item if children depends of it. Children: " + JSON.stringify(children, null,2))
    else return false
}

function isItemTarget(idCon){
    if(idCon.kindOfItem !== "node") return false
    const rels = idCon.relsItIsTargetOf(idCon)
    if (rels.length > 0) throw "Cannot delete an item if it is a target of relation. Relations: " + JSON.stringify(rels, null,2)
    else return false
}

function getRelsItIsSourceOf(idCon){
    if(idCon.kindOfItem !== "node") return []
    return idCon.relsItIsSourceOf()
}

function getFilesItIsSourceOf(rels){
    const paths = []
    for(let rel in rels){
        const defType = rels[rel].defType
        const id = rels[rel].id
        paths.push(`../db/${defType}/${id}.json`)
    }
    return paths
}

function getFilesToDelete(idCon, filesItIsSourceOf){
    const paths = [`../db/${idCon.defType}/${idCon.id}.json`]

    if(idCon.kindOfItem === "node") paths.push(...filesItIsSourceOf)

    return paths
}

function getIdsToDelete(idCon, rels){
    return [idCon.id, ...rels.map(rel => {
        return rel.id
    })]
}

module.exports = { DeleteController }