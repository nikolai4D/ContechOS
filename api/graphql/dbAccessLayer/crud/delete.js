const { deleteValidator } = require("../validation/deleteValidator")
const {deleteFile} = require("../fileManager");

async function deleteItem(params) {

    console.log("params: " + JSON.stringify(params, null, 2))
    try {
        if (!params.hasOwnProperty("id")) throw new Error("deletion interrupted: no id was provided in the parameters.")

        const delCon = new deleteValidator(params.id)

        const filesToDelete = delCon.filesToDelete

        console.log("here")

        console.log("files to delete: " + JSON.stringify(filesToDelete, null, 2))
        const deletionPromises = []
        for (let file in filesToDelete) {
            deletionPromises.push(deleteFile(filesToDelete[file]))
        }

        await Promise.all(deletionPromises)

        return delCon.idsToDelete
    } catch(e){
        return {
            status: "cancelled",
            error: "Deletion cancelled due to:\n" + e.message}
    }
}

module.exports = { deleteItem }
