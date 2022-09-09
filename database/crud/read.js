const {getCoordsFromId, getDefTypeFromCoords, getLayerFromId} = require("../helpers/id_parsers");
const {getItemById, getBulk} = require("../FileManager");
const {Voc} = require("../Voc");
const {doesDefTypeNameExist} = require("../helpers/checkers");

async function getItems(params) {

    try {

        let coords = [] // [layer, rel]
        const defTypes = []

        const { // TODO Validation of this params
            id,
            typeDef: defType,
            parentId,
            layer,
            sortOfItem,
            title, // Says it's not used, but it is.
            from,
            limit
        } = params

        // As in the files sourceId and targetId are named "source" and "target", we make the conversion here rather than propagate the inconsistency further.
        params['target'] = params['targetId']
        params['source'] = params['sourceId']

        //If id is defined we directly go to the correct defType.
        if (id !== undefined) {
            const coords = getCoordsFromId(id)
            const dfType = getDefTypeFromCoords(coords)
            console.log("typedef: " + dfType)
            return [await getItemById(id, dfType)]
        }

        //Otherwise we narrow the defType to look in as much as we can, based on the params at our disposal.
        if (defType !== undefined && doesDefTypeNameExist(defType)) {
            defTypes.push(defType)
        } else if (parentId !== undefined) {
            const pCoo = getCoordsFromId(parentId)
            coords.push([pCoo[0] + 1, pCoo[1]])
        } else if (params.target !== undefined) {
            const layer = getLayerFromId(params.target)
            coords.push([layer, 0], [layer, 1])
        } else if (params.source !== undefined) {
            const layer = getLayerFromId(params.source)
            coords.push([layer, 0], [layer, 1])
        } else if ([0, 1, 2, 3].includes(layer)) {
            coords.push([layer, null], [layer, 0], [layer, 1])
        } else { // Set all directories to be looked in.
            console.log("no successful defType inference, adding all defTypes.")
            for (let lay in Voc.layers) {
                const l = parseInt(lay)
                coords.push([l, null], [l, 0], [l, 1])
            }
        }

        if (sortOfItem !== undefined) {
            console.log("itemskinds: " + Voc.kindsOfItems)
            const sortIndex = Voc.kindsOfItems.findIndex(el => el === sortOfItem)
            if (sortIndex === -1) {
                console.log("sort of item unknown, valid values are: " + sortOfItem)
            }
            coords = coords.filter(coo => (sortIndex === 0 && coo[1] === null) || sortIndex === 1 && [0, 1].includes(coo[1]))
        }

        defTypes.push(...coords.map(coord => {
            return getDefTypeFromCoords(coord)
        }))

        const filterFunction = (item) => {
            for (let prop of ["target", "source", "parentId", "title", "created", "updated"]) {
                if (params[prop] !== undefined) {
                    if (!item.hasOwnProperty(prop) || params[prop] !== item[prop]) return false
                }
            }
            return true
        }

        const requestedItems = getBulk(defTypes, limit, from, filterFunction)

        // console.log("coords: " + JSON.stringify(coords))
        // console.log("defTypes: " + JSON.stringify(defTypes))
        // console.log("items length: " + requestedItems.length)
        // console.log("items: " + JSON.stringify(requestedItems, null, 2))

        return requestedItems

    } catch(e){
        return ("error: " + e)
    }
}

module.exports = {getItems}