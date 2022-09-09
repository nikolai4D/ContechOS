/**
 *
 * @param {String} id
 * @returns {Promise<boolean>}
 */
const {Voc} = require("../Voc");
const {getCoordsFromId, getDefTypeFromCoords} = require("./idParsers");
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

async function doesDefTypeNameExist(defType){
    Voc.layers.map(layer => {
        if( defType === layer[0]) return true
        else if (defType.substring(0, layer[0].length) === layer[0]){

            Voc.relationTypes.map(relType => {
                if (defType === relType[0]) return true
            })
        }
    })

    return false
}

module.exports = { doesItemExist, doesDefTypeNameExist }