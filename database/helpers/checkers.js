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

function isItemInRepository(id, defType){
    try {
        const items = [getItemById(id, defType)]
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

function arePropsValid(params){
    if(params.hasOwnProperty("propKeys")){
        ArePropKeysValid(params.key)
    }

    if(params.hasOwnProperty("props")){
        ArePropValuesValid(params.props)
    }

    for (let key in params.key){
        if(["propKeys", "typeDataPropKeys", "instanceDataPropKeys, typeDataRelPropKey, instanceDataRelPropKey"].includes(key)){
            if(!ArePropKeysValid(params[key])) throw ( key  + " are invalids.")
        }
        else if(key === "props"){
            if(!ArePropValuesValid(params[key])) throw ( key + " values are invalid.")
        }
    }

    return true
}

function ArePropKeysValid(propsArray){

}

function ArePropValuesValid(propsArray){
    let currentPropKey = ""

    for (let obj in propsArray){
        for (let propPair in obj) {
            if (propPair.keys[0] !== currentPropKey){
                console.log("previous propKey checked: " + currentPropKey + ". New propKey checked: " + propPair.keys[0])
                currentPropKey = propPair.key[0]

                if(!doesItemExist(currentPropKey))throw "Property Key " + currentPropKey + " was not found."
                else if (!doesItemExist(propPair[currentPropKey])) throw "Property values " + propPair[currentPropKey] + " was not found."
            }
        }
    }
    return true
}

function areParamsCoherent(){
    // ToDo
}

module.exports = { doesItemExist, doesDefTypeNameExist }