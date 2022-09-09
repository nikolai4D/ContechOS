const {Voc} = require("../Voc")
const {getLayerFromId, getDefTypeFromCoords}  = require("../idParsers")
const {doesItemExist} = require("../checkers")
const readItems = require("./read");
const { v4} = require('uuid');

function itemCreationParams(
    title,
    defType,
    parentId,
    sourceId,
    targetId,
    sortOfItem
){
    this.title = title
    this.parentId = parentId
    this.sourceId = sourceId
    this.targetId = targetId
    this.itemKind = sortOfItem
}

/**
 *
 * @param {itemCreationParams} params
 * @constructor
 */
async function createItem(params) {
    let coords = [undefined, null]

    const formattedParams = {
        created: new Date(),
        updated: new Date()
    }

    if (![Voc.itemKinds[0], Voc.itemKinds[1]].includes(params.itemKind)) {
        console.log("Creation interrupted: item kind not valid.")
        return
    }

    let defType

    if (!params.hasOwnProperty("title")) {
        console.log("Creation interrupted: a title was not provided")
        return
    } else formattedParams.title = params.title

    if (!params.hasOwnProperty("parentId")) {
        coords[0] = 0
    } else {
        if (! await doesItemExist(params.parentId)){
            console.log("Creation interrupted: parent does not exist")
            return
        }

        const parentLayerIndex = getLayerFromId(params.parentId)
        if (parentLayerIndex === 3) {
            console.log("Creation interrupted:: cannot create a child of an instance.")
            return
        } else {
            coords[0] = parentLayerIndex + 1
            formattedParams.parentId = params.parentId
        }
    }

    // If it is a relation
    if (params.itemKind === 1) {
        if (!params.hasOwnProperty("sourceId") || !params.hasOwnProperty("targetId")) {
            console.log("Creation interrupted: targetId or sourceId missing.")
            return
        } else {
            const sources = readItems(params.sourceId)
            if (sources.length === 0) {
                console.log("Creation interrupted: source could not be find.")
                return
            }
            const targets = readItems(params.targetId)
            if (targets.length === 0) {
                console.log("Creation interrupted: target could not be find.")
                return
            }

            coords[1] = (targets[0].parentId === sources[0].parentId) ? 0 : 1
            formattedParams.sourceId = params.sourceId
            formattedParams.targetId = params.targetId
        }
    }

    defType = getDefTypeFromCoords(coords)

    let prefix = Voc.layers[coords[0]][1]
    if (coords[1] !== null) prefix += Voc.relationTypes[coords[1]]

    let id =  prefix + "_" + v4()

    // TODO make sure params are also consistent between together (no targetId provided for node creation for example) -> do we want to do that?

    if (params.itemKind === 1) {
        formattedParams.source = params.sourceId
        formattedParams.target = params.targetId
    }

    console.log("defType: " + defType)
    console.log("id: " + id)
    console.log("prefjfix: " + (coords[1] === null)? "" : Voc.relationTypes(coords[1])[1])
    console.log("formattedParams: " + JSON.stringify(formattedParams, null, 2))
    //Here goes the fileManager Function

    // fileManager.CreateItem(id, defType, formattedParams)
}

module.exports = { createItem }