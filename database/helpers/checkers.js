/**
 *
 * @param {String} id
 * @returns {Promise<boolean>}
 */
const {Voc} = require("../Voc");
const {getCoordsFromId, getDefTypeFromCoords} = require("./id_parsers");
const {getItemById} = require("../FileManager");


function doesItemExist(id){
    let coords
    try {
        coords = getCoordsFromId(id)
    } catch (e) {
        console.log("error: " + e)
        return false
    }

    console.log("coords: " + coords)
    const dfType = getDefTypeFromCoords(coords)
    console.log("typedef: " + dfType)

    try {
        const items = [getItemById(id, dfType)]
        return items.length === 1
    } catch(e){
        return false
    }

}

function doesDefTypeNameExist(defType){
    for(let layer of Voc.layers) {
        console.log("layer[0]: " + layer[0])
        if( defType === layer[0]) return true

        for(let relType of Voc.relationTypes){
            if (defType === layer[0] + relType[0]) return true
        }
    }

    return false
}

module.exports = { doesItemExist, doesDefTypeNameExist }