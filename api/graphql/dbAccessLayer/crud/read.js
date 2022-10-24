const { getItemById, getBulk } = require("../fileManager");
const { validateId } = require("../validation/idValidator");
const { validateBulkFetch } = require("../validation/BulkFetchValidator");

async function getItems(params) {

    try {

        let requestedItems

        if (params.id !== undefined) {
            const idData = new validateId(params.id)
            requestedItems = [await getItemById(idData.id, idData.defType)]
        }
        else {
            let bfData = new validateBulkFetch(params)
            requestedItems = getBulk(bfData.defTypes, -1, bfData.from, bfData.filterFunction, bfData.filterParams)
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