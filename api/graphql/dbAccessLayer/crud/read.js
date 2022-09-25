const { getItemById, getBulk } = require("../fileManager");
const { validateId } = require("../validation/validateId");
const { validateBulkFetch } = require("../validation/validateBulkFetch");

async function getItems(params) {

    try {

        let requestedItems

        console.log("getItems: " + JSON.stringify(params, null, 2))
        if (params.id !== undefined) {
            const idData = new validateId(params.id)
            requestedItems = [await getItemById(idData.id, idData.defType)]
        }
        else {
            let bfData = new validateBulkFetch(params)
            //console.log("filterParams: " + JSON.stringify(bfData.filterParams, null, 2))

            requestedItems = getBulk(bfData.defTypes, bfData.limit, bfData.from, bfData.filterFunction, bfData.filterParams)
        }

        return requestedItems

    } catch (e) {
        return ({
            status: "cancelled",
            error: "Reading cancelled due to:\n" + e.message
        })
    }
}

module.exports = { getItems }