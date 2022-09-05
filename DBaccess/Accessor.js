const Record = require("../api/records/Record")
const {FileManager, getItemById, getBulk} = require("./FileManager");

const lexi = {
    itemKinds: ["node", "relation", "property"],
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

function QueryParams(
    id,
    defType,
    parentId,
    sourceId,
    targetId,
    layer,
    sortOfItem,
    title,
    from,
    limit
){
    this.id = id
    this.defType = defType
    this.parentId = parentId
    this.sourceId = sourceId
    this.targetId = targetId
    this.layer = layer
    this.sortOfItem = sortOfItem
    this.title = title
    this.from = from
    this.limit = limit
}

class Accessor{
    constructor(){

    }

    /**
     *
     * @param {QueryParams} params
     * @returns {Promise<any[]>}
     */
    async getItems(params) {

        const items = []
        let coords = [] // [layer, rel]
        const defTypes = []
        const possibleItems = lexi.itemKinds
        const relationsTypes = lexi.relationTypes
        const layers =  lexi.layers

        const {
            id,
            typeDef: defType,
            parentId,
            sourceId,
            targetId,
            layer,
            sortOfItem,
            title,
            from,
            limit
        } = params

        //If id is defined things are simple
        if (id !== undefined) {
            const coords = getCoordsFromId(id)
            const dfType = getDefTypeFromCoords(coords)
            console.log("typedef: " + dfType)
            return [await getItemById(id, dfType)]
        }

        if (defType !== undefined && isTypeDefNameValid(defType)) {
            defTypes.push(defType)
        }
        else if(parentId !== undefined){
            const pCoo =  getCoordsFromId(parentId)
            coords.push([pCoo[0] + 1, pCoo[1]])
        }
        else if (targetId !== undefined){
            const layer = getLayerFromId(targetId)
            coords.push([layer, 0], [layer, 1])
        }
        else if (sourceId !== undefined){
            const layer = getLayerFromId(sourceId)
            coords.push([layer, 0], [layer, 1])
        }
        else if ([0,1,2,3].includes(layer)){
            coords.push([layer, null], [layer, 0], [layer, 1])
        }
        else { //Create records for all directories
            console.log("no successful defType inference, adding all defTypes.")
            for (let lay in layers){
                const l = parseInt(lay)
                coords.push([l, null], [l, 0], [l, 1])
            }
        }

        if(sortOfItem !== undefined){
            const sortIndex = lexi.itemKinds.findIndex(el => el === sortOfItem)
            if(sortIndex === -1) {
                console.log("sort of item unknown, valid values are: " + sortOfItem)
            }

            console.log("sortIndex: " + sortIndex)
            coords = coords.filter(coo => (sortIndex === 0 && coo[1] === null) || sortIndex === 1 && [0,1].includes(coo[1]))
        }

        defTypes.push(...coords.map(coord => { return getDefTypeFromCoords(coord) }))

        const filterFunction = (item) => {
            for (let prop of ["targetId", "sourceId", "parentId", "title"]) {
                if(params[prop] !== undefined) {
                    if (!item.hasOwnProperty(prop) || params[prop] !== item[prop]) return false
                }
            }
            return true
        }

        const requestedItems = getBulk(defTypes, limit, from, filterFunction)

        console.log("coords: " + JSON.stringify(coords))
        console.log("defTypes: " + JSON.stringify(defTypes))
        console.log("items length: " + requestedItems.length)
        console.log("items: " + JSON.stringify(requestedItems, null, 2))
    }

    mutate(){

    }
}

function getDefTypeFromCoords(coords){
    let defType = lexi.layers[coords[0]][0]
    if(coords[1] !== null && coords[1] !== undefined) defType += lexi.relationTypes[coords[1]][0]
    return  defType
}

function getLayerFromId(id){
    const prefix = getPrefixFromString(id)
    return findLayerIndexByPrefix(prefix)
}

function getCoordsFromId(id){
    const prefix = getPrefixFromString(id)
    console.log("prefix: " + prefix)
    return getCoordsFromPrefix(prefix)
}

function getPrefixFromString(string){
    return string.substring(0,string.indexOf("_"))
}

function getCoordsFromPrefix(prefix){
    return [(findLayerIndexByPrefix(prefix)), getRelationIndexFromPrefix(prefix)]
}

function findLayerIndexByPrefix (prefix){
    return lexi.layers.findIndex(el => el[1] === prefix.substring(0,2))
}

function getRelationIndexFromPrefix(prefix){
    if(prefix.length !== 4) return null
    else if (prefix.charAt(2) === "e") return 0
    else if (prefix.charAt(2) === "i") return 1
}

function isTypeDefNameValid(name){
    for (let layer in lexi.layers){
        if(
            name === layer[0] ||
            name === layer[0] + lexi.relationTypes[0][0] ||
            name === layer[0] + lexi.relationTypes[1[0]]) return true
        return false
    }
}

module.exports = { Accessor }