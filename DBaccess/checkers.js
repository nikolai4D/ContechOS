/**
 *
 * @param {String} id
 * @returns {Promise<boolean>}
 */
const readItems = require("./crud/read");


async function doesItemExist(id){
    console.log("item exist? id: " + id)
    const items = await readItems({id})
    console.log("items: " + JSON.stringify(items))
    return items.length === 1
}

module.exports = { doesItemExist }