const slightlyMoreComplexDB = require("../slightlyMoreComplexDB");
const {Accessor} = require("../../../DBaccess/access");

function getItemById(id){
    const repertory = getRepertoryNameFromId(id)
    console.log("getNodebyId-> id:" + id + ", repertory: " + repertory)
    const item = slightlyMoreComplexDB[repertory].find(el => el.id === id)
    console.log({item})
    return item
}

function getAllNodes(){
    return [...slightlyMoreComplexDB.type_data, ...slightlyMoreComplexDB.instance_data]
}

function getAllRelations(){
    return [...slightlyMoreComplexDB.type_rel, ...slightlyMoreComplexDB.instance_rel]
}

function getAllItems(){
    return [...getAllNodes(), ...getAllRelations()]
}

const typesOfItems = ["all","node","relation"]


/**
 *
 * @param params an object, it's keys and values will be used to filter the elements of the array. Example: {target:"135", source:"245"}
 * @param typeOfItems Narrow the base array by selecting a specific sort of items. Accepted terms: "all" (default), "node", "relation".
 */
function getItemsMatchingParams(params, typeOfItems = "all"){
    let array = (params.hasOwnProperty("id"))? new Accessor().getItems({id: params.id}): getAllNodes()

    if(params.hasOwnProperty("id")) array = [getItemById(params.id)]
    else if( typeOfItems === typesOfItems[0]) array = getAllItems()
    else if( typeOfItems === typesOfItems[1]) array = getAllNodes()
    else if( typeOfItems === typesOfItems[2]) array = getAllRelations()

    for (let key in params){
        if (key === "id") continue

        array = filterByParam(array, key, params[key])
    }
    return array
}

/**
 *
 * @param array the array to filter
 * @param key the property looked for
 * @param value the value the property should match
 * @returns {*}
 */
function filterByParam(array, key, value){
    return array.filter(el => el[key] === value)
}

function getRepertoryNameFromId(id){
    let layer
    switch (id[2]) {
        case "t":
            layer = "type"
            break;
        case "i":
            layer = "instance"
            break;
        default:
            console.log("layer prefix unknown: " + id[2])
    }

    let nature
    switch (id[0]) {
        case "n":
            nature = "data"
            break;
        case "r":
            nature = "rel"
            break;
        default:
            console.log("nature prefix unknown: " + id[0])
    }

    return layer+"_"+nature
}

module.exports = {getItemsMatchingParams, getItemById, getAllRelations, getAllNodes}