const {Voc} = require("../Voc")
const {getLayerFromId, getDefTypeFromCoords, getDefTypeFromId}  = require("../helpers/id_parsers")
const {doesItemExist} = require("../helpers/checkers")
const { v4} = require('uuid');
const {createFile, getItemById} = require("../FileManager")

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

        console.log("params: " + JSON.stringify(params))
        let coords = []
        let prefix = ""
        let suffix =""
        const formattedParams = {
            created: new Date(),
            updated: new Date()
        }

        if (![Voc.kindsOfItems[0], Voc.kindsOfItems[1]].includes(params.kindOfItem)) {
            throw("Creation interrupted: kind of item not valid.")
        }

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
                prefix = Voc.layers[coords[0]][1]
                formattedParams.parentId = params.parentId
            }
        }

        console.log("coords: " + JSON.stringify(coords))

        // If it is a relation
        if (params.kindOfItem === Voc.kindsOfItems[1]) {
            if (!params.hasOwnProperty("sourceId") || !params.hasOwnProperty("targetId")) {
                throw("Creation interrupted: targetId or sourceId missing.")
            } else {

                // Make sure source and target exist
                let source = getItemById(params.sourceId, getDefTypeFromId(params.sourceId))
                let target = getItemById(params.targetId, getDefTypeFromId(params.targetId))
                if(source === undefined || target === undefined) throw("Something went wrong when trying to identify source or target.")

                if(params.hasOwnProperty("parentId")){
                    let relParentId = params.parentId
                    let sourceParentId = source.parentId
                    let targetParentId = target.parentId

                    let parentRel = getItemById(relParentId, getDefTypeFromId(relParentId))
                    if(parentRel.source !== sourceParentId || parentRel.target !== targetParentId) {
                        throw("creation interrupted: relation, source and target do not have valid parents.")
                    }
                }
                else {
                    if(getLayerFromId(params.sourceId) !== 0 || getLayerFromId(params.targetId) !== 0){
                        throw("creation interrupted: no parentId provided, source and target defType should be configDef.")
                    }
                }

                formattedParams.source = params.sourceId
                formattedParams.target = params.targetId
                let isInternal = params.sourceId === params.targetId
                coords[1] = isInternal? 1 : 0
                prefix += Voc.relationTypes[coords[1]][1]
                suffix = "_" + params.sourceId + "_" + params.targetId
            }
        }

        let defType = getDefTypeFromCoords(coords)
        let id = prefix + "_" + v4() + suffix

        // TODO make sure params are also consistent together (no targetId provided for node creation for example) -> do we want to do that?

        // TODO check and add properties to the item

        console.log("defType: " + defType)
        console.log("id: " + id)
        console.log("formattedParams: " + JSON.stringify(formattedParams, null, 2))

        return await createFile(defType, id, formattedParams)

    } catch(e){
        return e
    }
}

module.exports = { createItem }