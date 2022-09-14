const {getItemById, getBulk} = require("../FileManager");
const {IdData} = require("../control/IdController");
const {BulkFetchData} = require("../control/BulkFetchController");

async function getItems(params) {

    try {

        let requestedItems


        if (params.id !== undefined) {
            const idData = new IdData(params.id)
            requestedItems = [await getItemById(idData.id, idData.defType)]
        }
        else {
            let bfData = new BulkFetchData(params)
            requestedItems = getBulk(bfData.defTypes, bfData.limit, bfData.from, bfData.filterFunction, bfData.filterParams)
        }

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