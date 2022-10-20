const { getItemById, getBulk } = require("../fileManager");
const { validateId } = require("../validation/validateId");
const { validateBulkFetch } = require("../validation/validateBulkFetch");
const variableToArray = require("../helpers/variableToArray");

async function getItems(params) {

    try {

        let requestedItems

        if (params.id !== undefined) {

            let ids = variableToArray(params.id)
            let requestedItems = []
            for (let id of ids) {
                const idData = new validateId(params.id)
                requestedItems.push(await getItemById(idData.id, idData.defType))
            }
            return requestedItems
        }
        else {
            let bfData = new validateBulkFetch(params)
            console.log(JSON.stringify(bfData.filterParams, null, 2))
            requestedItems = getBulk(bfData.defTypes, -1, bfData.from, bfData.filterFunction, bfData.filterParams)
        }

        return requestedItems

    } catch (e) {
        console.log("error! " + e)
        return ({
            status: "cancelled",
            error: "Reading cancelled due to:\n" + e.message
        })
    }
}

module.exports = { getItems }