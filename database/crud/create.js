const {Voc} = require("../Voc")
const {getLayerFromId, getDefTypeFromCoords}  = require("../helpers/id_parsers")
const {doesItemExist} = require("../helpers/checkers")
const { readItems } = require("./read");
const { v4} = require('uuid');
const {createFile} = require("../FileManager")

function itemCreationParams(
    title,
    defType,
    parentId,
    sourceId,
    targetId,
    kindOfItem
){
    this.title = title
    this.parentId = parentId
    this.sourceId = sourceId
    this.targetId = targetId
    this.kindOfItem = kindOfItem
}

/**
 *
 * @param {itemCreationParams} params
 * @constructor
 */
async function createItem(params) {
    try {

        let coords = []

        const formattedParams = {
            created: new Date(),
            updated: new Date()
        }

        if (![Voc.kindsOfItems[0], Voc.kindsOfItems[1]].includes(params.kindOfItem)) {
            throw("Creation interrupted: item kind not valid.")
        }

        let defType

        if (!params.hasOwnProperty("title")) {
            throw("Creation interrupted: a title was not provided")
        } else formattedParams.title = params.title

        if (!params.hasOwnProperty("parentId")) {
            coords[0] = 0
        } else {
            if (!doesItemExist(params.parentId)) {
                throw("Creation interrupted: parent does not exist")
            }

            const parentLayerIndex = getLayerFromId(params.parentId)
            if (parentLayerIndex === 3) {
                throw("Creation interrupted:: cannot create a child of an instance.")
            } else {
                coords[0] = parentLayerIndex + 1
                formattedParams.parentId = params.parentId
            }
        }

        console.log("coords: " + JSON.stringify(coords))

        // If it is a relation
        if (params.kindOfItem === 1) {
            if (!params.hasOwnProperty("sourceId") || !params.hasOwnProperty("targetId")) {
                throw("Creation interrupted: targetId or sourceId missing.")
            } else {
                const sources = readItems(params.sourceId)
                if (sources.length === 0) {
                    throw("Creation interrupted: source could not be find.")
                }
                const targets = readItems(params.targetId)
                if (targets.length === 0) {
                    throw("Creation interrupted: target could not be find.")
                }

                coords[1] = (targets[0].parentId === sources[0].parentId) ? 0 : 1
                formattedParams.sourceId = params.sourceId
                formattedParams.targetId = params.targetId
            }
        }

        console.log("coords: " + JSON.stringify(coords))
        defType = getDefTypeFromCoords(coords)

        let prefix = Voc.layers[coords[0]][1]
        if (coords[1] !== undefined ) prefix += Voc.relationTypes[coords[1]]

        let id = prefix + "_" + v4()

        // TODO make sure params are also consistent between together (no targetId provided for node creation for example) -> do we want to do that?

        // TODO check and add properties to the item

        if (params.kindOfItem === 1) {
            formattedParams.source = params.sourceId
            formattedParams.target = params.targetId
        }

        console.log("defType: " + defType)
        console.log("id: " + id)
        console.log("formattedParams: " + JSON.stringify(formattedParams, null, 2))
        //Here goes the fileManager Function

        return await createFile(defType, id, formattedParams)

    } catch(e){
        return e
    }
}

module.exports = { createItem }